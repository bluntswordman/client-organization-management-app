import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import FormLogin from '@app/(authentication)/login/_fragments/FormLogin';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function Login() {
  const token = (await cookies()).get('JSESSIONID');

  if (token) {
    const lastPath = (await cookies()).get('lastPath');
    redirect(`${lastPath?.value ?? '/'}`);
  }

  return <FormLogin />;
}
