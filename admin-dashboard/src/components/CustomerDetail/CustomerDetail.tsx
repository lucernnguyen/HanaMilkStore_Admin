import React from 'react';
import { useParams } from 'react-router-dom';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Dữ liệu mẫu cho chi tiết khách hàng
  const customer = {
    id: id,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
    registrationDate: '2024-05-25'
  };

  // Dữ liệu mẫu cho các đơn hàng của khách hàng
  const orders = [
    { id: 1, date: '2024-05-25', items: '3 items', total: '$300' },
    { id: 2, date: '2024-05-24', items: '2 items', total: '$200' },
    { id: 3, date: '2024-05-23', items: '1 item', total: '$100' }
  ];

  return (
    <div>
      <h1>Chi tiết khách hàng</h1>
      <div className="card">
        <h2>{customer.name}</h2>
        <p>Email: {customer.email}</p>
        <p>Điện thoại: {customer.phone}</p>
        <p>Địa chỉ: {customer.address}</p>
        <p>Ngày đăng ký: {customer.registrationDate}</p>
      </div>
      <h2>Đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Ngày</th>
            <th>Mặt hàng</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.items}</td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetail;
