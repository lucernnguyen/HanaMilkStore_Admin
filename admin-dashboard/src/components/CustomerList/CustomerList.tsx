import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerList.css';
import { Customer, User } from '../../types/User';
import customerService from '../api/customerService';
import userService from '../api/userService';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData: Customer[] = await customerService.getAllCustomers();
        const customersWithDetails = await Promise.all(
          customerData.map(async (customer: Customer) => {
            const userDetails: User = await userService.getUserById(customer.userId);
            return { ...customer, userDetails };
          })
        );
        setCustomers(customersWithDetails);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="customer-list-container">
      <h1>Danh sách khách hàng</h1>
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên khách hàng</th>
            <th>Ngày đăng ký</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: Customer) => (
            <tr key={customer.memberId}>
              <td>
                {customer.userDetails?.profilePicture ? (
                  <img 
                    src={customer.userDetails.profilePicture} 
                    alt={`${customer.userDetails?.userName}'s profile`} 
                    className="profile-picture" 
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td><Link to={`/customers/customer-details/${customer.memberId}`}>{customer.userDetails?.userName}</Link></td>
              <td>{customer.userDetails?.dateCreate}</td>
              <td>{customer.userDetails?.phone}</td>
              <td>{customer.userDetails?.address}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
