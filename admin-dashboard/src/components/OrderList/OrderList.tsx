import React, { useEffect, useState } from 'react';
import orderService from '../api/orderService';
import { Order } from '../../types/Order';
import { Link } from 'react-router-dom';
import styles from './OrderList.module.css';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>(''); // State for selected status
  const pageSize = 5;

  useEffect(() => {
    const fetchOrders = async (page: number, pageSize: number, status: string) => {
      try {
        const data = await orderService.getOrdersByOrderStatus(page, pageSize, status);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };
    fetchOrders(page, pageSize, status);
  }, [page, status]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1); // Reset to first page when status changes
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className={styles['order-list-container']}>
      <h2>Danh sách đơn hàng</h2>
      <div className={styles['filter-container']}>
        <label htmlFor="status">Trạng thái đơn hàng: </label>
        <select id="status" value={status} onChange={handleStatusChange}>
          <option value="">Tất cả</option>
          <option value="đang chờ">Đang chờ</option>
          <option value="chưa thanh toán">Chưa thanh toán</option>
          <option value="hoàn thành">Hoàn thành</option>
        </select>
      </div>
      <table className={styles.table}>
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
              <td><Link to={`/order-detail/${order.orderId}`}>Xem chi tiết</Link></td>
              <td>{formatCurrency(order.amount)}</td>
              <td>{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={page === 1}>Trang trước</button>
        <button onClick={handleNextPage} disabled={orders.length < pageSize}>Trang tiếp</button>
      </div>
    </div>
  );
};

export default OrderList;
