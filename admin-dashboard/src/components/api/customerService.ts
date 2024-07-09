import axios from 'axios';
import { Member } from '../../types/User';

const API_URL = 'https://localhost:7188/api/members';

const getAllCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error in getAllCustomers:', error);
    throw error;
  }
};

const getCustomerById =  async (id: number): Promise<Member> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const customerService = {
  getAllCustomers,
  getCustomerById,
};

export default customerService;
