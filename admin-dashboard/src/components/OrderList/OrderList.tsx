import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import { Order } from '../../types/Order';
import './Order.css';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderService.getAllOrders();
        const ordersWithNames = await Promise.all(
          ordersData.map(async (order) => {
            const memberName = await orderService.getMemberNameById(order.memberId);
            const voucherName = await orderService.getVoucherNameById(order.voucherId);
            return { ...order, memberName, voucherName };
          })
        );
        
        setOrders(ordersWithNames);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId: number) => {
    navigate(`/order-detail/${orderId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-list-container">
      <h2>Order List</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Member Name</th>
            <th>Voucher Name</th>
            <th>Order Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId} onClick={() => handleOrderClick(order.orderId)} style={{ cursor: 'pointer' }}>
              <td>{order.orderId}</td>
              <td>{order.memberName}</td>
              <td>{order.voucherName}</td>
              <td>{order.dateCreate}</td>
              <td>{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
