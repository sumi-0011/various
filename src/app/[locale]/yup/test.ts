import * as Yup from 'yup';

export const FILE_SIZE_MB = 10 * 1024 * 1024;
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

export const YUP_SCHEMA = {
  REQUIRED: Yup.string().required('input_required'),
  NOT_REQUIRED: Yup.string().notRequired(),
  NUM_REQUIRED: Yup.number().typeError('validation_number').required('input_required'),
  EMAIL_REQUIRED: Yup.string().email('invalid_email').required('input_required'),
  FILE_REQUIRED: Yup.mixed()
    .required('input_required')
    .test('fileSize', 'rest_api_file_exceeds_size_error', (value) => value?.size <= FILE_SIZE_MB)
    .test('fileType', 'rest_api_file_upload_error', (value) => SUPPORTED_FORMATS.includes(value?.type)),
  FILE: Yup.mixed()
    .test('fileSize', 'rest_api_file_exceeds_size_error', (value) => (value ? value.size <= FILE_SIZE_MB : true))
    .test('fileType', 'rest_api_file_upload_error', (value) => (value ? SUPPORTED_FORMATS.includes(value.type) : true)),

  CREDIT_CARD_NUMBER_REQUIRED: Yup.string()
    .matches(/^[0-9]{16}$/, 'Invalid card number')
    .required('input_required'),
  CREDIT_CARD_CVC_REQUIRED: Yup.string()
    .matches(/^[0-9]{3,4}$/, 'Invalid CVC')
    .required('input_required'),
  CREDIT_CARD_DATE_REQUIRED: Yup.string()
    .required('input_required')
    .test('valid-month', 'Invalid month', function (value) {
      if (!value) {
        return false;
      }

      const [, month] = value.split('-').map((item) => parseInt(item, 10));

      return month >= 1 && month <= 12;
    })
    .test('is-future-date', 'Expiry date must be in the future', function (value) {
      if (!value) {
        return false;
      }

      const currentDate = new Date();
      const [year, month] = value.split('-').map((item) => parseInt(item, 10));

      // Adding 1 to the month because JavaScript months are zero-indexed
      const expiryDate = new Date(year + 2000, month, 1);

      return expiryDate > currentDate;
    }),

  CHINESE: Yup.string()
    .matches(/^[\u4e00-\u9fff\u3400-\u4dbf\uF900-\uFAFF]+$/, 'Name must be written in Chinese')
    .required('input_required'),
  NUMBER: Yup.string().matches(/^\d+$/, 'invalid_input').required('input_required'),
};
