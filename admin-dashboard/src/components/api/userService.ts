import axios from 'axios';
const API_URL = 'https://localhost:7188/api/users';

const getUserById= async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  };
  const getUserByFilter  = async (phone: string) => {
    const response = await axios.get(`${API_URL}?phone=${phone}`);
    return response.data;
};
const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
const userService = {
    getUserById,
    getUserByFilter,
    deleteUser
};
export default userService;
