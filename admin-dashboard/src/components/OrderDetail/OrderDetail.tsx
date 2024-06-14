import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div id="order-details-section" className="section">
      <div className="section-header">
        <h2>Order Details for Order #{id}</h2>
      </div>
      <div className="order-details">
        <p>Customer: John Doe</p>
        <p>Date: 2023-06-01</p>
        <p>Status: Pending</p>
        <p>Total: $100</p>
        {/* Add more order details as needed */}
      </div>
    </div>
  );
};

export default OrderDetails;
