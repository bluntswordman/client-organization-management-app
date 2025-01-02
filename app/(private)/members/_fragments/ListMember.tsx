'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { TableProps } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import { createContext, useState } from 'react';

import { getAllMembers } from '@domain/events/member.service';
import Link from 'next/link';

interface DataType {
  key: string;
  id: string;
  name: string;
  position: string;
}

const SearchContext = createContext<
  | {
      data: { content: DataType[]; totalElements: number } | undefined;
      pagination: { page: number; size: number };
      setPagination: (pagination: { page: number; size: number }) => void;
      search: string;
      setSearch: (search: string) => void;
    }
  | undefined
>(undefined);

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <SearchContext.Consumer>
        {(context) =>
          context && (
            <div style={{ padding: 8 }}>
              <Input
                autoFocus
                placeholder='Search Name'
                value={selectedKeys[0] || ''}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                }}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <div className='w-full flex justify-between items-center gap-2'>
                <Button
                  type='default'
                  onClick={() => {
                    clearFilters();
                    context.setSearch('');
                  }}
                  size='small'
                  style={{ width: 90 }}
                >
                  Reset
                </Button>
                <Button
                  type='primary'
                  onClick={() => {
                    confirm();
                    context.setSearch(selectedKeys[0] || '');
                  }}
                  size='small'
                  style={{ width: 90 }}
                >
                  Search
                </Button>
              </div>
            </div>
          )
        }
      </SearchContext.Consumer>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
  },
  {
    key: 'action',
    render: (record) => {
      return (
        <Space>
          <Link
            href={`/members/${record.id}`}
            className='!border-gray-500 !text-gray-500 hover:!border-gray-800 hover:!text-gray-800 transition-all duration-300 px-2 py-[7px] border rounded-md'
          >
            <EyeOutlined />
          </Link>
          <Button
            className='!border-blue-600 !text-blue-600 hover:!border-blue-700 hover:!text-blue-800 transition-all duration-300'
            icon={<EditOutlined />}
          />
          <Button
            className='!border-red-600 !text-red-600 hover:!border-red-800 hover:!text-red-800 transition-all duration-300'
            icon={<DeleteOutlined />}
          />
        </Space>
      );
    },
  },
];

const ListMember = () => {
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['members', pagination, search],
    queryFn: () => getAllMembers(pagination, search || undefined),
  });

  return (
    <SearchContext.Provider
      value={{ data, pagination, setPagination, search, setSearch }}
    >
      <Table
        columns={columns}
        dataSource={data?.content}
        rowKey='id'
        scroll={{ x: 'max-content' }}
        pagination={{
          current: pagination.page + 1,
          pageSize: pagination.size,
          total: data?.totalElements,
          onChange: (page, size) => setPagination({ page: page - 1, size }),
        }}
      />
    </SearchContext.Provider>
  );
};

export default ListMember;
