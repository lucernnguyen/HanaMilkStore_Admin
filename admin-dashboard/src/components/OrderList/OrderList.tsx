import React, { useEffect, useState } from 'react';
import orderService from '../api/orderService';
import statusService from '../api/statusService';
import { Order } from '../../types/Order';
import { Link } from 'react-router-dom';
import styles from './OrderList.module.css';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<{ statusId: number, status: string }[]>([]);
  const [page, setPage] = useState(1);
  const [statusId, setStatusId] = useState<number>(0); // State for selected statusId
  const pageSize = 5;

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await statusService.getAllStatuses();
        setStatuses(data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
        setStatuses([]);
      }
    };
    fetchStatuses();
  }, []);

  useEffect(() => {
    const fetchOrders = async (page: number, pageSize: number, statusId: number) => {
      try {
        const data = await orderService.getOrdersByOrderStatus(page, pageSize, statusId);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };
    fetchOrders(page, pageSize, statusId);
  }, [page, statusId]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatusId = parseInt(e.target.value, 10);
    setStatusId(selectedStatusId);
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

  const getStatusName = (statusId: number) => {
    const status = statuses.find(status => status.statusId === statusId);
    return status ? status.status : 'Unknown';
  };

  return (
    <div className={styles['order-list-container']}>
      <h2>Danh sách đơn hàng</h2>
      <div className={styles['filter-container']}>
        <label htmlFor="status">Trạng thái đơn hàng: </label>
        <select id="status" value={statusId.toString()} onChange={handleStatusChange}>
          <option value="0">Tất cả</option>
          {statuses.map(status => (
            <option key={status.statusId} value={status.statusId}>{status.status}</option>
          ))}
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã Đơn hàng</th>
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
              <td>{getStatusName(order.statusId)}</td>
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
