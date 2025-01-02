import { PlusOutlined } from '@ant-design/icons';
import { Col, Divider, Flex, Row, Skeleton } from 'antd';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ListMember = dynamic(
  () => import('@/app/(private)/members/_fragments/ListMember'),
  { loading: () => <Skeleton active /> }
);

export const metadata: Metadata = {
  title: 'Member',
};

export default function MemberPage() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Flex vertical>
          <div className='w-full flex items-center space-x-4'>
            <h2 className='text-xl font-semibold text-gray-950'>List Member</h2>
            <Link
              href='members/create'
              className='inline-flex gap-2 border p-2 border-blue-600 text-blue-600 rounded-md hover:!border-blue-800 hover:!text-blue-800 transition-all duration-300'
            >
              <PlusOutlined />
            </Link>
          </div>
          <Divider />
        </Flex>
      </Col>
      <Col span={24}>
        <ListMember />
      </Col>
    </Row>
  );
}
