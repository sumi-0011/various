/* eslint-disable @typescript-eslint/naming-convention */

import { yup } from '@lib/yup';

export const FILE_SIZE_MB = 10 * 1024 * 1024;
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

export const YUP_SCHEMA = {
  CONDITINAL_VALID: {
    schema: yup.object().shape({
      user_type: yup.string().required(),
      password: yup.string().test({
        name: 'admin-password-required',
        message: '관리자는 비밀번호가 필요합니다',
        test(value) {
          if (this.parent.user_type === 'admin') {
            return Boolean(value && value.trim().length > 0);
          }
          return true;
        },
      }),
    }),
    schemaString: `
    const schema = yup.object().shape({
      user_type: yup.string().required(),
      user: yup.object()
        .shape({
          name: yup.string().required(),
          password: yup.string(),
        })
        .test({
          name: 'admin-password-required',
          message: '관리자는 비밀번호가 필요합니다',
          test(value: { password?: string; name: string }) {
            if (this.parent.user_type === 'admin') {
              return Boolean(value.password && value.password.trim().length > 0);
            }
            return true;
          },
        }),
    }),
    `,
  },
};
