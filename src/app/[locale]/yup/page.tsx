'use client';

import React, { useState } from 'react';

import Editor from '@monaco-editor/react';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function YupValidator() {
  // 검증할 입력값들의 상태
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  // schemaCode를 state로 변경
  const [schemaCode, setSchemaCode] = useState(`
const userSchema = yup.object({
  username: yup.string()
    .required('사용자명은 필수입니다')
    .min(4, '사용자명은 최소 4자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다'),
  email: yup.string()
    .required('이메일은 필수입니다')
    .email('올바른 이메일 형식이 아닙니다'),
  password: yup.string()
    .required('비밀번호는 필수입니다')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      '비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다'
    )
});`);

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
        `
        ${schemaCode}
        return userSchema;
      `
      );

      const userSchema = createSchema(yup);
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
          <div>
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              name="username"
              value={inputs.username}
              onChange={handleInputChange}
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={inputs.email}
              onChange={handleInputChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={inputs.password}
              onChange={handleInputChange}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

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
