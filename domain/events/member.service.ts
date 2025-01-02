import Axios from '@infrastructure/libs/axios';

interface Pagination {
  page?: number;
  size?: number;
}

interface Member {
  name: string;
  positionId: string;
  picture: any;
  position: string;
}

export const getAllMembers = async (
  pagination: Pagination,
  search?: string
) => {
  let { page, size } = pagination;

  page = page || 0;
  size = size || 10;

  try {
    const response = await Axios.get('/members', {
      params: {
        page,
        size,
        search,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveMember = async (data: FormData) => {
  try {
    const response = await Axios.post('/members', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberById = async (id: string) => {
  try {
    const response = await Axios.get(`/members/${id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
