import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DetailMember = dynamic(
  () => import('@app/(private)/members/_fragments/DetailMember')
);

export const metadata: Metadata = {
  title: 'Detail Member',
};

export default async function DetailMembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log('slug', slug);

  return (
    <div>
      <DetailMember id={slug} />
    </div>
  );
}
