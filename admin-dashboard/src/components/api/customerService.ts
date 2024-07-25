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
const deleteCustomer = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    throw error;
  }
}
const customerService = {
  getAllCustomers,
  getCustomerById,
  deleteCustomer
};

export default customerService;
