import axios from 'axios';


const API_URL = 'https://localhost:7188/api/status';

 const getStatusById = async (statusId: number  | ''): Promise<string> => {
    try {
      const response = await axios.get(`${API_URL}/${statusId}`);
      return response.data.status; 
    } catch (error) {
      console.error('Error fetching status:', error);
      return 'Unknown';
    }
  };
  const getAllStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
  }
const statusService = {
    getStatusById,
    getAllStatuses
    };

export default statusService;
