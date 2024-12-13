'use client';

import React, { useState } from 'react';

import Editor from '@monaco-editor/react';
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
    .join('\n');

  if (constString) {
    return `${constString}

const schema = yup.object({\n${schemaString}\n});
    `;
  }

  return `const schema = yup.object({\n${schemaString}\n});`;
};

function YupValidator(props: { schema: SchemaInfoType }) {
  // 검증할 입력값들의 상태
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  // schemaCode를 state로 변경
  const [schemaCode, setSchemaCode] = useState(getSchemaString(props.schema));

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 스키마 변경 핸들러 추가
  const handleSchemaChange = (value: string) => {
    setSchemaCode(value);
  };

  // 검증 실행 함수 수정
  const handleValidate = async () => {
    try {
      // Function 생성자를 사용하여 동적으로 스키마 생성
      const createSchema = new Function(
        'yup',
        `${schemaCode}
        return schema;
      `
      );

      const userSchema = createSchema(yup);
      console.log('userSchema: ', userSchema);
      await userSchema.validate(inputs, { abortEarly: false });
      setErrors({});
      setIsValid(true);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setErrors({ schema: '스키마 문법이 올바르지 않습니다.' });
        setIsValid(false);
        return;
      }

      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner?.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        setIsValid(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>사용자 정보 검증</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 스키마 코드 표시 (읽기 전용) */}
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
          {errors.schema && <p className="mt-1 text-sm text-red-500">{errors.schema}</p>}
        </div>

        {/* 입력 폼 */}
        <div className="space-y-4">
          {Object.entries(props.schema.schema).map(([key]) => (
            <InputItem
              value={inputs[key as keyof typeof inputs]}
              onChange={handleInputChange}
              error={errors[key as keyof typeof errors]}
              id={key}
              key={key}
            />
          ))}

          <Button onClick={handleValidate} className="w-full">
            검증하기
          </Button>

          {isValid && <div className="rounded-md bg-green-100 p-4 text-green-800">모든 입력값이 유효합니다!</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export default YupValidator;

function InputItem(props: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  id: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{props.id}</Label>
      <Input
        id={props.id}
        name={props.id}
        type="password"
        value={props.value}
        onChange={props.onChange}
        className={cn(props.error ? 'border-red-500' : '')}
      />
      {props.error && <p className="text-sm text-red-500">{props.error}</p>}
    </div>
  );
}
