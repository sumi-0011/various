'use client';

import React, { useState } from 'react';

import Editor from '@monaco-editor/react';
import { Formik, Form, Field, FormikHelpers, useField, ErrorMessage } from 'formik';
import { js as beautify } from 'js-beautify';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@lib/utils';

import { SchemaInfoType } from './schema';

const getSchemaString = (schema: SchemaInfoType) => {
  const schemaString = Object.entries(schema.schema)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join(',\n');

  const constString = Object.entries(schema.constants || {})
    .map(([key, value]) => `const ${key} = ${value};`)
    .join('');

  let code = '';
  if (constString) {
    code = `${constString}\n\nconst schema = yup.object({\n${schemaString}\n});`;
  } else {
    code = `const schema = yup.object({\n${schemaString}\n});`;
  }

  try {
    const formattedCode = beautify(code, {
      indent_size: 2,
      space_in_empty_paren: true,
      preserve_newlines: true,
      end_with_newline: true,
    });
    return formattedCode;
  } catch (error) {
    console.error('코드 포맷팅 실패:', error);
    return code;
  }
};

// 폼 값을 위한 인터페이스 추가
interface FormValues {
  username: string;
  email: string;
  password: string;
  [key: string]: string;
}

function YupValidator(props: { schema: SchemaInfoType }) {
  const [schemaCode, setSchemaCode] = useState(getSchemaString(props.schema));
  const [validationError, setValidationError] = useState<string>('');

  const initialValues: FormValues = Object.keys(props.schema.schema).reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as FormValues);

  const handleSchemaChange = (value: string) => {
    setSchemaCode(value);
  };

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      const createSchema = new Function(
        'yup',
        `${schemaCode}
        return schema;`
      );

      const userSchema = createSchema(yup);
      await userSchema.validate(values, { abortEarly: false });
      setValidationError('');
      actions.setStatus({ success: true });
    } catch (err) {
      if (err instanceof SyntaxError) {
        setValidationError('스키마 문법이 올바르지 않습니다.');
      } else if (err instanceof yup.ValidationError) {
        err.inner?.forEach((error) => {
          if (error.path) {
            actions.setFieldError(error.path, error.message);
          }
        });
      }
      actions.setStatus({ success: false });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>사용자 정보 검증</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6">
          <Label>검증 스키마 (수정 가능)</Label>
          <Editor
            height="200px"
            defaultLanguage="javascript"
            value={schemaCode}
            theme="vs-dark"
            onChange={(value) => handleSchemaChange(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
          {validationError && <p className="mt-1 text-sm text-red-500">{validationError}</p>}
        </div>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ status }) => (
            <Form className="space-y-4">
              {Object.entries(props.schema.schema).map(([key]) => (
                <InputItem key={key} name={key} />
              ))}

              <Button type="submit" className="w-full">
                검증하기
              </Button>

              {status?.success && (
                <div className="rounded-md bg-green-100 p-4 text-green-800">모든 입력값이 유효합니다!</div>
              )}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

// InputItem 컴포넌트를 Formik Field로 변경
function InputItem({ name }: { name: string }) {
  const [, meta] = useField(name);
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{name}</Label>
      <Field
        as={Input}
        id={name}
        name={name}
        type={name === 'password' ? 'password' : 'text'}
        className={cn(meta.error ? 'border-red-500' : '')}
      />

      <ErrorMessage name={name}>{(message) => <p className="text-sm text-red-500">{message}</p>}</ErrorMessage>
    </div>
  );
}

export default YupValidator;
