// voucherService.ts
import axios from 'axios';
import { Voucher, NewVoucher } from '../../types/Voucher';

const API_URL = 'https://localhost:7188/api/vouchers';
const STATUS_API_URL = 'https://localhost:7188/api/voucher-status';

const getAllVouchers = async (page: number, pageSize: number): Promise<Voucher[]> => {
  const response = await axios.get(`${API_URL}?pageIndex=${page}&pageSize=${pageSize}`);
  return response.data;
};
const getVoucherById = async (id: number): Promise<Voucher> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}
const deleteVoucher = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
const updateVoucher = async (voucherId: number, voucher: Voucher): Promise<void> => {
  await axios.put(`${API_URL}/${voucherId}`, voucher);
};
const createVoucher = async (voucher: NewVoucher): Promise<void> => {
  await axios.post(API_URL, voucher);
};
const getAllVoucherStatuses = async () => {
  try {
    const response = await axios.get(`${STATUS_API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw error;
  }
}
const voucherService = {
  getAllVouchers,
  deleteVoucher,
  createVoucher,
  getVoucherById,
  updateVoucher,
  getAllVoucherStatuses
}
export default  voucherService;
