import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDetail.css';
import { Member, User } from '../../types/User';
import userService from '../api/userService';
import customerService from '../api/customerService';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchMemberDetails();
  }, [id]);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!member || !user) {
    return <div>Member details not found.</div>;
  }

  

  return (
    <div className="customer-detail-container">
      <h1>Chi tiết thành viên</h1>
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
            <th>Giỏ hàng</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {member.orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.dateCreate}</td>
              <td>
              <Link to={`/order-detail/${order.orderId}`}>Xem chi tiết</Link>              </td>
              <td>{formatCurrency(order.amount)}</td>
              <td>{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetail;
