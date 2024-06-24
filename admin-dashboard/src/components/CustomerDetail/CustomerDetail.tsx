import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './CustomerDetail.css';
import { Order } from '../../types/Order';
import { Customer, User } from '../../types/User';
import customerService from '../api/customerService';
//import orderService from '../api/orderService';
import userService from '../api/userService';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerData: Customer = await customerService.getCustomerById(Number(id));
        setCustomer(customerData);

        const userData: User = await userService.getUserById(customerData.userId);
        setUser(userData);

        //const ordersData: Order[] = await orderService.getOrdersByCustomerId(Number(id));
        //setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching customer details:', error);
        setError('Failed to fetch customer details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!customer || !user) {
    return <div>Customer details not found.</div>;
  }

  return (
    <div className="customer-detail-container">
      <h1>Chi tiết khách hàng</h1>
      <div className="card">
        <h2>{user.userName}</h2>
        <p>Điện thoại: {user.phone}</p>
        <p>Địa chỉ: {user.address}</p>
        <p>Ngày đăng ký: {user.dateCreate}</p>
      </div>
      <h2>Đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Ngày</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.dateCreate}</td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetail;
