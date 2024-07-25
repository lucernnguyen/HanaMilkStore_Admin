import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDetail.css';
import { Member, User } from '../../types/User';
import userService from '../api/userService';
import customerService from '../api/customerService';
import statusService from '../api/statusService'; // Import statusService

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number>(0); // State for status filter
  const [statuses, setStatuses] = useState<{ statusId: number, status: string }[]>([]); // State for statuses

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const memberData: Member = await customerService.getCustomerById(Number(id));
        setMember(memberData);

        const userData: User = await userService.getUserById(memberData.userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setError('Failed to fetch member details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchStatuses = async () => {
      try {
        const data = await statusService.getAllStatuses();
        setStatuses(data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
        setStatuses([]);
      }
    };

    fetchMemberDetails();
    fetchStatuses();
  }, [id]);

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatusId = parseInt(e.target.value, 10);
    setStatusFilter(selectedStatusId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!member || !user) {
    return <div className="error">Member details not found.</div>;
  }

  const filteredOrders = statusFilter === 0 
    ? member.orders 
    : member.orders.filter(order => order.statusId === statusFilter);
  const getStatusName = (statusId: number) => {
      const status = statuses.find(status => status.statusId === statusId);
      return status ? status.status : 'Unknown';
    };
  return (
    <div className="customer-detail-container">
      <h1>Chi tiết thành viên</h1>
      <div className="card">
        <div className="user-info">
          <h2>{user.userName}</h2>
          <p>Điện thoại: {user.phone}</p>
          <p>Địa chỉ: {user.address}</p>
          <p>Ngày đăng ký: {user.dateCreate}</p>
        </div>
        {user.profilePicture && (
          <div className="profile-picture">
            <img src={user.profilePicture} alt={`${user.userName}'s profile`} />
          </div>
        )}
      </div>
      <h2>Đơn hàng</h2>
      <div className="status-filter">
        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
        <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="0">Tất cả</option>
          {statuses.map(status => (
            <option key={status.statusId} value={status.statusId}>{status.status}</option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Ngày</th>
            <th>Giỏ hàng</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.dateCreate}</td>
              <td>
                <Link to={`/order-detail/${order.orderId}`}>Xem chi tiết</Link>
              </td>
              <td>{formatCurrency(order.amount)}</td>
              <td>{getStatusName(order.statusId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetail;
