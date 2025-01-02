import { AntdRegistry } from '@ant-design/nextjs-registry';
import { PropsWithChildren } from 'react';

export default function AntDesignProvider({ children }: PropsWithChildren) {
  return <AntdRegistry>{children}</AntdRegistry>;
}
