import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LatestOrder.css';
import { Order } from '../../types/Order';
import orderService from '../api/orderService';

const LatestOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestOrders = async () => {
      try {
        const data = await orderService.getNewestOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching latest orders:', error);
        setError('Failed to fetch latest orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="latest-orders">
      <h3>Đơn hàng mới</h3>
      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Giỏ hàng</th>
            <th>Tổng giá trị</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.memberName}</td>
              <td>{order.dateCreate}</td>
              <td>{order.itemsCount} items</td>
              <td>{order.amount.toLocaleString('vi-VN')} Đồng</td>
              <td>
                <Link to={`/order-detail/${order.orderId}`}>
                  <button>Chi tiết</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><Link to="/orders" id="view-orders-link">Xem tất cả đơn hàng</Link></p>
    </div>
  );
};

export default LatestOrders;
