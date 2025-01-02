import { Col, Divider, Flex, Row } from 'antd';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const FormPosition = dynamic(
  () => import('@app/(private)/positions/_fragments/FormPosition')
);

export const metadata: Metadata = {
  title: 'Position',
};

export default function PositionPage() {
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
        <FormPosition />
      </Col>
    </Row>
  );
}
