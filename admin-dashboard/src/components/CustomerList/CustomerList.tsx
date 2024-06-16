import React from 'react';
import { Link } from 'react-router-dom';

const CustomerList: React.FC = () => {
  // Dữ liệu mẫu cho danh sách khách hàng
  const customers = [
    { id: 1, name: 'Jane Smith', email: 'jane.smith@example.com', registrationDate: '2024-05-25', phone: '123-456-7890', address: '123 Main St, City, Country' },
    { id: 2, name: 'John Doe', email: 'john.doe@example.com', registrationDate: '2024-05-24', phone: '987-654-3210', address: '456 Main St, City, Country' },
    { id: 3, name: 'Alice Brown', email: 'alice.brown@example.com', registrationDate: '2024-05-23', phone: '555-666-7777', address: '789 Main St, City, Country' },
    { id: 4, name: 'Mike Johnson', email: 'mike.johnson@example.com', registrationDate: '2024-05-22', phone: '222-333-4444', address: '101 Main St, City, Country' }
  ];

  return (
    <div>
      <h1>Danh sách khách hàng</h1>
      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Ngày đăng ký</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td><Link to={`/customer-details/${customer.id}`}>{customer.name}</Link></td>
              <td>{customer.email}</td>
              <td>{customer.registrationDate}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td><button>Chỉnh sửa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
