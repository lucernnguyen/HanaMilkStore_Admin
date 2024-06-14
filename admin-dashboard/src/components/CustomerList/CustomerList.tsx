import React from 'react';
import { Link } from 'react-router-dom';

const CustomerList: React.FC = () => {
  // Dữ liệu mẫu cho danh sách khách hàng
  const customers = [
    { id: 1, name: 'Jane Smith' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alice Brown' },
    { id: 4, name: 'Mike Johnson' }
  ];

  return (
    <div>
      <h1>Danh sách khách hàng</h1>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            <Link to={`/customer-details/${customer.id}`}>{customer.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
