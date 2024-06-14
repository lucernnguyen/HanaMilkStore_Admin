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
    address: '123 Main St, City, Country'
  };

  return (
    <div>
      <h1>Chi tiết khách hàng</h1>
      <p>Tên: {customer.name}</p>
      <p>Email: {customer.email}</p>
      <p>Điện thoại: {customer.phone}</p>
      <p>Địa chỉ: {customer.address}</p>
    </div>
  );
};

export default CustomerDetail;
