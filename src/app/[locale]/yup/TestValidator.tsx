/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';

import { Editor } from '@monaco-editor/react';
import * as Yup from 'yup';

import cn from '@lib/cn';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

import { YUP_SCHEMA } from './test';

export function TestValidator() {
  const { schema, schemaString } = YUP_SCHEMA.CONDITINAL_VALID;

  return (
    <div>
      <pre>{schemaString}</pre>
    </div>
  );
}

export function TestYupItem() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const { schema, schemaString } = YUP_SCHEMA.CONDITINAL_VALID;
  const [inputs, setInputs] = useState({
    user_type: '',
    password: '',
  });

  const handleValidate = async () => {
    // user_name -> user.name
    const validInput = {
      user_type: inputs.user_type,
      password: inputs.password,
    };

    try {
      const result = await schema.validate(validInput);
      console.log('result: ', result);
      setIsValid(true);
      setErrors({});
    } catch (err) {
      console.log('err: ', err);
      if (err instanceof SyntaxError) {
        setErrors({ schema: '스키마 문법이 올바르지 않습니다.' });
        setIsValid(false);
        return;
      }

      if (err instanceof Yup.ValidationError) {
        console.log('err: ', err);
        const newErrors: Record<string, string> = {};
        newErrors.schema = err.message;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>테스트 검증</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6">
          <Label>검증 스키마 (수정 불가능)</Label>
          <Editor
            height="200px"
            defaultLanguage="javascript"
            value={schemaString}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </div>
        <div className="space-y-4">
          <InputItem id="user_type" value={inputs.user_type} onChange={handleInputChange} error="" />
          <InputItem id="password" value={inputs.password} onChange={handleInputChange} error="" />

          <Button onClick={handleValidate} className="w-full">
            검증하기
          </Button>

          {errors && <p className="mt-1 text-sm text-red-500">{Object.values(errors).join('\n')}</p>}
          {isValid && <div className="rounded-md bg-green-100 p-4 text-green-800">모든 입력값이 유효합니다!</div>}
        </div>
      </CardContent>
    </Card>
  );
}

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
        value={props.value}
        onChange={props.onChange}
        className={cn(props.error ? 'border-red-500' : '')}
      />
      {props.error && <p className="text-sm text-red-500">{props.error}</p>}
    </div>
  );
}
