import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const OrganizationChart = dynamic(
  () => import('@app/(private)/_fragments/OrganizationChart')
);

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {
  return (
    <div>
      <OrganizationChart />
    </div>
  );
}
