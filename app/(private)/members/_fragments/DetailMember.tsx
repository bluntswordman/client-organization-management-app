'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Form, Input, Select, Typography } from 'antd';
import Image from 'next/image';
import { FC, useEffect } from 'react';

import { BASE_STATIC_URL } from '@infrastructure/utils/constant';

import { getMemberById } from '@domain/events/member.service';

interface MemberProps {
  id: string;
}

const DetailMember: FC<MemberProps> = ({ id }) => {
  const [form] = Form.useForm();
  const { data } = useQuery({
    queryKey: ['detail-member', id],
    queryFn: () => getMemberById(id),
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        position: data.position.id,
      });
    }
  }, [data]);

  console.log('data', data);

  return (
    <div className='w-full flex justify-center'>
      <Card className='w-full md:w-3/12'>
        <Form layout='vertical' form={form}>
          <div className='flex flex-col items-center '>
            <div className='flex justify-center'>
              <Image
                width={100}
                height={100}
                src={
                  data?.profileImage
                    ? `${BASE_STATIC_URL}/images/${data.profileImage}`
                    : '/images/avatar.png'
                }
                className='rounded-full border'
                alt='avatar'
              />
            </div>
            <div className='flex flex-col w-full'>
              <Form.Item label='Name' name='name'>
                <Input placeholder='Name' disabled />
              </Form.Item>
              <Form.Item label='Position' name='position'>
                <Select placeholder='Position' disabled>
                  {data?.position?.id && (
                    <Select.Option
                      key={data.position.id}
                      value={data.position.id}
                    >
                      {data.position.name}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
              <div className='flex flex-col w-full gap-2'>
                <Typography.Text strong>Reports</Typography.Text>
                <div className='w-full flex flex-col gap-2'>
                  {data?.reports?.length > 0 &&
                    data?.reports.map(
                      (report: Record<string, string>, index: number) => (
                        <div
                          key={index}
                          className='flex flex-col items-center mb-2 p-2 border border-gray-200 rounded-md gap-3'
                        >
                          <div className='flex gap-2 w-full'>
                            <Input
                              placeholder='Title'
                              value={report.title}
                              disabled
                            />
                          </div>
                          <Input.TextArea
                            placeholder='Content'
                            value={report.content}
                            disabled
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default DetailMember;
