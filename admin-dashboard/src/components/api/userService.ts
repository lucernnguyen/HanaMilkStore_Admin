import axios from 'axios';
const API_URL = 'https://localhost:7188/api/users';

const userService = {
  getUserById: async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
};

export default userService;
