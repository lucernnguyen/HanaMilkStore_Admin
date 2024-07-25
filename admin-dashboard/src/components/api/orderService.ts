import axios from 'axios';
import { Order, OrderDetail } from '../../types/Order';
import customerService from './customerService';
import userService from './userService';

const API_URL = 'https://localhost:7188/api/orders';
const ORDER_DETAIL_API_URL = 'https://localhost:7188/api/order-details';

const MEMBER_API_URL = 'https://localhost:7188/api/members';
const VOUCHER_API_URL = 'https://localhost:7188/api/vouchers';
const USER_API_URL = 'https://localhost:7188/api/users';
const COMMENT_API_URL = 'https://localhost:7188/api/comments';
                 
const getAllOrders = async (page: number, pageSize: number): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}?pageIndex=${page}&pageSize=${pageSize}`);
  return response.data;
};
const getOrdersByOrderStatus = async (page: number, pageSize: number, statusId: number) => {
  const statusQuery = statusId ? `&orderStatus=${encodeURIComponent(statusId)}` : '';
  const response = await axios.get(`${API_URL}?pageIndex=${page}&pageSize=${pageSize}${statusQuery}`);
  return response.data;
};
const getAllOrdersNoPagination = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};
const getNewestOrders = async () : Promise<Order[]> => {
  try{
    const response = await axios.get(`${API_URL}?IsDescending=true&pageIndex=1&pageSize=4`)
    const orders = response.data;

    // Lấy thông tin khách hàng và đếm số lượng sản phẩm
    const ordersWithDetails = await Promise.all(orders.map(async (order: any) => {
      const member = await customerService.getCustomerById(order.memberId);
      const user = await userService.getUserById(member.userId);
      const memberName = user.userName;
      const itemsCount = order.orderDetails.length;

      return {
        ...order,
        memberName,
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
const getOrderDetailsById = (orderDetailId: number) => {
  return axios.get(`${ORDER_DETAIL_API_URL}/${orderDetailId}`).then(res => res.data);
};

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

const updateOrderStatus = async (orderId: number, statusId: number, voucherId?: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${orderId}`, { statusId, voucherId }); // Thêm voucherId vào đối tượng
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};
const deleteOrderDetail = async (orderDetailId: number) => {
  try {
    await axios.delete(`${ORDER_DETAIL_API_URL}/${orderDetailId}`);
  } catch (error) {
    console.error('Error in deleteOrderDetail:', error);
    throw error;
  }
}
const deleteOrder = async (orderId: number) => {
  try {
    await axios.delete(`${API_URL}/${orderId}`);
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    throw error;
  }
}
const getProductDetailsByOrderDetailId = (orderDetailId: number) => {
  return axios.get(`${API_URL}/order-details/${orderDetailId}`).then(res => res.data);
};
const getAllComments = async () => {
  const response = await axios.get(`${COMMENT_API_URL}`);
  return response.data;
}
const deleteComment = async (commentId: number) => {
  try {
    await axios.delete(`${COMMENT_API_URL}/${commentId}`);
  } catch (error) {
    console.error('Error in deleteComment:', error);
    throw error;
  }
}
const orderService = {
  getAllOrders,
  getOrderById,
  getMemberNameById,
  getVoucherNameById,
  updateOrderStatus,
 getNewestOrders,
 getProductDetailsByOrderDetailId,
 getOrderDetailsById,
  getAllOrdersNoPagination,
  getOrdersByOrderStatus,
  deleteOrderDetail,
  deleteOrder,
  getAllComments,
  deleteComment
};

export default orderService;
