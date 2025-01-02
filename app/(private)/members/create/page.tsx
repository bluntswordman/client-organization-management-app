import { Col, Divider, Flex, Row, Skeleton } from 'antd';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const FormMember = dynamic(
  () => import('@/app/(private)/members/_fragments/FormMember'),
  { loading: () => <Skeleton active /> }
);

export const metadata: Metadata = {
  title: 'Create Member',
};

export default function CreateMemberPage() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Flex vertical>
          <div className='w-full flex items-center space-x-4'>
            <h2 className='text-xl font-semibold text-gray-950'>
              Create Position
            </h2>
          </div>
          <Divider />
        </Flex>
      </Col>
      <Col span={24}>
        <FormMember />
      </Col>
    </Row>
  );
}
