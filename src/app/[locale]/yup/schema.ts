/* eslint-disable no-useless-escape */

type SchemaType = Record<string, string>;

export type SchemaInfoType = {
  title: string;
  desc?: string;
  schema: SchemaType;
  constants?: Record<string, unknown>;
};

export const schemaInfo: {
  [key: string]: SchemaInfoType;
} = {
  email: {
    title: '이메일 검증',
    desc: '이메일 검증',
    schema: {
      email: `yup.string().required('이메일은 필수입니다').email('올바른 이메일 형식이 아닙니다')`,
    },
  },
  password: {
    title: '비밀번호 검증',
    desc: '입력한 비밀번호가 올바른지 검증합니다.',
    schema: {
      password: `yup.string().required('비밀번호는 필수입니다')`,
    },
  },
  passwordReinput: {
    title: '비밀번호 재입력',
    desc: '입력한 비밀번호가 기존 비밀번호와 일치하는지 검증합니다.',
    schema: {
      password: `yup.string().required('비밀번호는 필수입니다')`,
      passwordConfirm: `yup.string().required('비밀번호 확인은 필수입니다').oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다')`,
    },
  },
  username: {
    title: '사용자명 검증',
    desc: '사용자명 검증',
    schema: {
      username: `yup.string().required('사용자명은 필수입니다').min(4, '사용자명은 최소 4자 이상이어야 합니다').max(20, '사용자명은 최대 20자까지 가능합니다')`,
    },
  },
  required: {
    title: '필수 입력',
    desc: '필수 입력',
    schema: {
      required: `yup.string().required('필수 입력입니다')`,
    },
  },

  file: {
    title: '파일 검증',
    desc: '파일 검증 최대 10MB',
    constants: {
      FILE_SIZE_MB: `10 * 1024 * 1024`,
      SUPPORTED_FORMATS: `['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'application/pdf']`,
    },
    schema: {
      file: `yup.mixed()
    .test('fileSize', 'rest_api_file_exceeds_size_error', (value) => (value ? value.size <= FILE_SIZE_MB : true))
    .test('fileType', 'rest_api_file_upload_error', (value) => (value ? SUPPORTED_FORMATS.includes(value.type) : true))`,
    },
  },
  conditionalValid1: {
    title: 'Conditional Validation',
    desc: 'admin input -> password required',
    schema: {
      user_type: `yup.string().required()`,
      password: `yup.string().test({
        name: 'admin-password-required',
        message: '관리자는 비밀번호가 필요합니다',
        test(value) {
          if (this.parent.user_type === 'admin') {
            return Boolean(value && value.trim().length > 0);
          }
          return true;
        },
      }) `,
    },
  },
};

export type SchemaInfoKey = keyof typeof schemaInfo;
