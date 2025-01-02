'use client';

import {
  GlobalOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RollbackOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Grid, Layout, Menu, MenuProps, theme } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CSSProperties, FC, ReactNode, useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const siderStyle: CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  transition: 'all 0.3s ease-in-out',
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/clear-session');
    router.push('/login');
  };

  useEffect(() => {
    setCollapsed(!screens.md);
  }, [screens.md]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout
      style={{
        position: 'relative',
      }}
    >
      <Sider
        style={{
          ...siderStyle,
          transform:
            screens.md || !collapsed ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 1,
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme='light'
      >
        <div className='demo-logo-vertical' />
        <Menu
          style={{ padding: 8 }}
          theme='light'
          mode='inline'
          selectedKeys={[currentPath]}
          items={[
            {
              key: '1',
              label: 'Dashboard',
              icon: (
                <Link href='/'>
                  <HomeOutlined />
                </Link>
              ),
            },
            {
              key: '2',
              label: 'Members',
              icon: (
                <Link href='/members'>
                  <UserOutlined />
                </Link>
              ),
            },
            {
              key: '3',
              label: 'positions',
              icon: (
                <Link href='/positions'>
                  <GlobalOutlined />
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            margin: '16px',
            padding: 0,
            background: colorBgContainer,
            marginInlineStart: collapsed ? (screens.md ? 100 : 15) : 225,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <div className='flex items-center justify-between h-full w-full '>
            <div>
              <Button
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className='!w-16 !h-16 !text-2xl'
              />
              {collapsed && !screens.md && (
                <Button
                  type='text'
                  icon={<RollbackOutlined />}
                  onClick={() => router.back()}
                  className='!w-16 !h-16 !text-2xl'
                />
              )}
            </div>
            <div>
              <Dropdown menu={{ items }} trigger={['click']}>
                <Button
                  type='text'
                  icon={<SettingOutlined />}
                  className='!w-16 !h-16 !text-2xl'
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginInlineStart: screens.md ? (collapsed ? 100 : 225) : 15,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
