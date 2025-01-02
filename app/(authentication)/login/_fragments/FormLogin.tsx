'use client';

import { Button, Card, Form, Grid, Input, theme, Typography } from 'antd';

import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const FormLogin = () => {
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = (values: unknown) => {
    console.log('Received values of form: ', values);
  };

  const handleLoginGoogle = () => {
    window.location.href = 'http://localhost:8080/api/v1/auth/login';
  };

  return (
    <section
      className={`flex items-center justify-center
        ${screens.sm ? 'h-screen' : 'auto'}
    `}
      style={{
        backgroundColor: token.colorBgContainer,
        padding: screens.md ? `${token.sizeXXL}px 0px` : '0px',
      }}
    >
      <Card className='w-full md:w-3/12'>
        <div
          className={`text-center`}
          style={{
            marginBottom: token.marginXL,
          }}
        >
          <Title
            style={{
              fontSize: screens.md
                ? token.fontSizeHeading2
                : token.fontSizeHeading3,
            }}
          >
            Log in
          </Title>
          <Text
            style={{
              color: token.colorTextSecondary,
            }}
          >
            Sign in to your account
          </Text>
        </div>
        <Form
          name='normal_signup'
          onFinish={onFinish}
          layout='vertical'
          requiredMark='optional'
        >
          <Form.Item
            name='email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder='Email' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <div className='flex flex-col items-center justify-center space-y-2'>
            <Button block type='primary' htmlType='submit'>
              Log in
            </Button>
            <span>Or</span>
            <Button block icon={<GoogleOutlined />} onClick={handleLoginGoogle}>
              Sign in with Google
            </Button>
          </div>
        </Form>
      </Card>
    </section>
  );
};

export default FormLogin;
