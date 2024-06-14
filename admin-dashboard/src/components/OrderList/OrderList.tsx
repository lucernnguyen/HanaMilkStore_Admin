import React from 'react';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  return (
    <div id="orders-section" className="section">
      <div className="section-header">
        <h2>Orders</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>2023-06-01</td>
            <td>Pending</td>
            <td>$100</td>
            <td>
              <Link to="/order-details/1">
                <button>View Details</button>
              </Link>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
