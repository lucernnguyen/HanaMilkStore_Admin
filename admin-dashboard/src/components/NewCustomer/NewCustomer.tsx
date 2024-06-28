import React, { useEffect, useState } from 'react';
import './NewCustomer.css';
import { User, Member } from '../../types/User';
import customerService from '../api/customerService';
import userService from '../api/userService';
import { Link } from 'react-router-dom';

const NewCustomers: React.FC = () => {
  const [newCustomers, setNewCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewCustomers = async () => {
      try {
        const members: Member[] = await customerService.getAllCustomers();
        const users: User[] = await Promise.all(members.map(async (member: Member) => {
          const user = await userService.getUserById(member.userId);
          return user;
        }));

        setNewCustomers(users);
      } catch (error) {
        console.error('Error fetching new customers:', error);
        setError('Failed to fetch new customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="new-customers">
      <h3>Khách hàng mới</h3>
      <div className="customer-cards">
        {newCustomers.map((customer) => (
          <div key={customer.userId} className="customer-card">
          <div className="customer-info">
            <p className="customer-name">{customer.userName}</p>
            <p className="customer-date">{customer.dateCreate}</p>
          </div>
          <img src={customer.profilePicture} alt="Icon" className="icon" />
        </div>
        
        ))}
      </div>
      <p><Link to="/customers">Xem tất cả khách hàng</Link></p>
    </div>
  );
};

export default NewCustomers;