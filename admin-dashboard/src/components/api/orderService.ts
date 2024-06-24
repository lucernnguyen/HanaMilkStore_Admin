import axios from 'axios';
import { Order, OrderDetail } from '../../types/Order';
import customerService from './customerService';
import userService from './userService';

const API_URL = 'https://localhost:7188/api/orders';

const MEMBER_API_URL = 'https://localhost:7188/api/members';
const VOUCHER_API_URL = 'https://localhost:7188/api/vouchers';
const USER_API_URL = 'https://localhost:7188/api/users';

                 
const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
};
const getNewestOrders = async () : Promise<Order[]> => {
  try{
    const response = await axios.get(`${API_URL}?IsDescending=true&pageIndex=4`)
    const orders = response.data;

    // Lấy thông tin khách hàng và đếm số lượng sản phẩm
    const ordersWithDetails = await Promise.all(orders.map(async (order: any) => {
      const member = await customerService.getCustomerById(order.memberId);
      const user = await userService.getUserById(member.userId);
      const customerName = user.userName;
      const itemsCount = order.orderDetails.length;

      return {
        ...order,
        customerName,
        itemsCount,
      };
    }));
    return ordersWithDetails;
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
}
const getOrderById = async (id: number): Promise<OrderDetail> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return {
      ...response.data,
      orderDetails: response.data.orderDetails || [],
      memberName: '',
      voucherName: ''
    };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

//const getOrdersByCustomerId =  async (customerId: number): Promise<Order[]> => {
  //const response = await axios.get<Order[]>(`${API_URL}?memberId=${customerId}`);
  //return response.data;
//};
const getMemberNameById = async (memberId: number): Promise<string> => {
  try {
    const response = await axios.get(`${MEMBER_API_URL}/${memberId}`);
    const userId = response.data.userId;
    const userResponse = await axios.get(`${USER_API_URL}/${userId}`);
    const userInfo = userResponse.data.userName;
    return userInfo;
  } catch (error) {
    console.error('Error in getMemberNameById:', error);
    throw error;
  }
};

const getVoucherNameById = async (voucherId: number): Promise<string> => {
  try {
    const response = await axios.get(`${VOUCHER_API_URL}/${voucherId}`);
    return response.data.title;
  } catch (error) {
    console.error('Error in getVoucherNameById:', error);
    throw error;
  }
};

const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${orderId}/status`, { status });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};

const orderService = {
  getAllOrders,
  getOrderById,
  getMemberNameById,
  getVoucherNameById,
  updateOrderStatus,
 // getOrdersByCustomerId,
 getNewestOrders,
};

export default orderService;
