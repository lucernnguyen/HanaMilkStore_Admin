// voucherService.ts
import axios from 'axios';
import { Voucher, NewVoucher } from '../../types/Voucher';

const API_URL = 'https://localhost:7188/api/vouchers';

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

const createVoucher = async (voucher: NewVoucher): Promise<void> => {
  await axios.post(API_URL, voucher);
};

const voucherService = {
  getAllVouchers,
  deleteVoucher,
  createVoucher,
  getVoucherById
}
export default  voucherService;
