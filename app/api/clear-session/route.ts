import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('JSESSIONID');

  if (token) (await cookies()).delete('JSESSIONID');

  return new Response('Session cleared', {
    status: 200,
  });
}
