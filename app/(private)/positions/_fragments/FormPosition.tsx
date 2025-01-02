'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Form, Input, notification, Select } from 'antd';
import { useCallback } from 'react';

import {
  getBrowsePosition,
  savePosition,
} from '@domain/events/position.service';

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string;
}

const FormPosition = () => {
  const [form] = Form.useForm();

  const { data: positions, refetch } = useQuery({
    queryKey: ['positions'],
    queryFn: getBrowsePosition,
  });

  const mutation = useMutation({
    mutationFn: async (values: Record<string, string | null>) => {
      const position = await savePosition(values);
      console.log('position', position);

      return position;
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Position has been saved',
      });
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    },
    mutationKey: ['positions'],
  });

  const onFinish = useCallback(async () => {
    console.log('values', form.getFieldsValue());

    const payload: Record<string, string | null> = {
      name: form.getFieldsValue().name,
      description: [undefined, null, ''].includes(
        form.getFieldsValue().description
      )
        ? null
        : form.getFieldsValue().description,
      parentId: [undefined, null, ''].includes(form.getFieldsValue().parentId)
        ? null
        : form.getFieldsValue().parentId,
    };

    await mutation.mutateAsync(payload);

    form.resetFields();
  }, [form, mutation]);

  return (
    <div className='w-full flex justify-center'>
      <Card className='w-full md:w-3/12'>
        <Form layout='vertical' form={form} onFinish={onFinish}>
          <div className='flex flex-col items-center '>
            <div className='flex flex-col w-full'>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item
                label='Description'
                name='description'
                rules={[{ required: false }]}
              >
                <Input placeholder='Description' />
              </Form.Item>
              <Form.Item
                label='Parent Position'
                name='parentId'
                rules={[{ required: false }]}
              >
                <Select placeholder='Position' allowClear>
                  {positions?.map((position: Position) => (
                    <Select.Option key={position.id} value={position.id}>
                      {position.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Button type='primary' htmlType='submit' className='w-full'>
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default FormPosition;
