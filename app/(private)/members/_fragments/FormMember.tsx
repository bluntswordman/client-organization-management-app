'use client';

import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { GetProp, UploadProps } from 'antd';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  notification,
  Select,
  Upload,
  UploadFile,
} from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { saveMember } from '@domain/events/member.service';
import { getBrowsePosition } from '@domain/events/position.service';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string;
}

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const FormMember = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [reports, setReports] = useState<{ title: string; content: string }[]>(
    []
  );

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: getBrowsePosition,
  });

  const mutation = useMutation({
    mutationFn: async (values: FormData) => {
      await saveMember(values);
    },
    onSuccess: () => {
      router.push('/members');
    },
    onError: (error) => {
      notification.error({
        message: 'Failed to save member',
        description: error.message,
      });
    },
  });

  const handleChange: UploadProps['onChange'] = (info) => {
    let file = [...info.fileList];
    file = file.slice(-1);

    setFileList(file);

    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const addReport = () => {
    setReports([...reports, { title: '', content: '' }]);
  };

  const removeReport = (index: number) => {
    const updatedReports = reports.filter((_, i) => i !== index);
    setReports(updatedReports);
  };

  const updateReport = (
    index: number,
    key: 'title' | 'content',
    value: string
  ) => {
    const updatedReports = [...reports];
    updatedReports[index][key] = value;
    setReports(updatedReports);
  };

  const onSubmit = useCallback(async () => {
    const formData = new FormData();
    const pictureFile = fileList[0]?.originFileObj;

    formData.append('name', form.getFieldValue('name'));
    formData.append('positionId', form.getFieldValue('position'));
    if (pictureFile) {
      formData.append('profileImage', (pictureFile as File) || null);
    }
    formData.append(
      'superiorId',
      positions?.find(
        (position: Position) => position.id === form.getFieldValue('position')
      )?.parentId || null
    );

    reports.forEach((report, index) => {
      formData.append(`reports[${index}].title`, report.title);
      formData.append(`reports[${index}].content`, report.content);
    });

    mutation.mutate(formData);
  }, [form, positions, mutation, fileList]);

  return (
    <div className='w-full flex justify-center'>
      <Card className='w-full md:w-3/12'>
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <div className='flex flex-col items-center '>
            <Form.Item name='picture'>
              <Upload
                name='avatar'
                listType='picture-circle'
                className='avatar-uploader'
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                showUploadList={false}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt='avatar'
                    width={100}
                    height={100}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <button
                    style={{ border: 0, background: 'none' }}
                    type='button'
                  >
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                )}
              </Upload>
            </Form.Item>
            <div className='flex flex-col w-full'>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item
                label='Position'
                name='position'
                rules={[
                  { required: true, message: 'Please select your position!' },
                ]}
              >
                <Select placeholder='Position'>
                  {positions?.map((position: Position) => (
                    <Select.Option key={position.id} value={position.id}>
                      {position.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <div className='w-full flex flex-col gap-2'>
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center mb-2 p-2 border border-gray-200 rounded-md gap-3'
                  >
                    <div className='flex gap-2 w-full'>
                      <Input
                        placeholder='Title'
                        value={report.title}
                        onChange={(e) =>
                          updateReport(index, 'title', e.target.value)
                        }
                        style={{ flex: 1 }}
                      />
                      <Button
                        type='default'
                        danger
                        onClick={() => removeReport(index)}
                        icon={<DeleteOutlined />}
                      ></Button>
                    </div>
                    <Input.TextArea
                      placeholder='Content'
                      value={report.content}
                      onChange={(e) =>
                        updateReport(index, 'content', e.target.value)
                      }
                      style={{ flex: 2 }}
                    />
                  </div>
                ))}
                <Button type='dashed' onClick={addReport} className='mb-5'>
                  Add Report
                </Button>
              </div>
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

export default FormMember;
