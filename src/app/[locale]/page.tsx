import { redirect } from '@i18n/routing';

export default function Page() {
  redirect({ href: '/maker', locale: 'en-US' });
}
