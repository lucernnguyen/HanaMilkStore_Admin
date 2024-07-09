import React, { useEffect, useState } from 'react';
import orderService from '../api/orderService';
import { Order } from '../../types/Order';
import { Link } from 'react-router-dom';
import './Order.css';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchOrders = async (page: number, pageSize: number) => {
      try {
        const data = await orderService.getAllOrders(page, pageSize);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };
    fetchOrders(page, pageSize);
  }, [page]);

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

 

  return (
    <div className="order-list-container">
      <h2>Danh sách đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Ngày tạo</th>
            <th>Giỏ hàng</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.dateCreate}</td>
              <td>
              <Link to={`/order-detail/${order.orderId}`}>Xem chi tiết</Link>
              </td>
              <td>{order.amount}</td>
              <td>{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
      <button onClick={handlePreviousPage} disabled={page === 1}>Trang trước</button>
      <button onClick={handleNextPage} disabled={orders.length < pageSize}>Trang tiếp</button>
      </div>
    </div>
  );
};

export default OrderList;
