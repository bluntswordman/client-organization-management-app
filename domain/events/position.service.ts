import Axios from '@infrastructure/libs/axios';

export const getBrowsePosition = async () => {
  try {
    const response = await Axios.get('/positions/browse');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const savePosition = async (values: Record<string, string | null>) => {
  try {
    const response = await Axios.post('/positions', values);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStructureOrganization = async () => {
  try {
    const response = await Axios.get('/positions/organization-chart');
    return response.data;
  } catch (error) {
    throw error;
  }
};
