import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../api/orderService';
import { OrderDetail } from '../../types/Order';
import './OrderDetail.css';

const OrderDetailComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await orderService.getOrderById(Number(id));
        const memberData = await orderService.getMemberNameById(data.memberId);
        const voucherData = await orderService.getVoucherNameById(data.voucherId);
        // Thêm memberName và voucherName vào data
        data.memberName = memberData;
        data.voucherName = voucherData;
        setOrderDetail(data);
      } catch (error) {
        console.error('Error fetching order detail:', error);
        setError('Failed to fetch order detail. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (orderDetail) {
      try {
        await orderService.updateOrderStatus(orderDetail.orderId, newStatus);
        // Refresh order detail to reflect the updated status
        const updatedOrderDetail = await orderService.getOrderById(orderDetail.orderId);
        setOrderDetail(updatedOrderDetail);
      } catch (error) {
        console.error('Error updating order status:', error);
        setError('Failed to update order status. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderDetail) {
    return <div>No order detail available.</div>;
  }

  return (
    <div className="order-detail-container">
      <h2>Order Detail</h2>
      <p><strong>Order ID:</strong> {orderDetail.orderId}</p>
      <p><strong>Member Name:</strong> {orderDetail.memberName}</p>
      <p><strong>Voucher Name:</strong> {orderDetail.voucherName}</p>
      <p><strong>Order Date:</strong> {orderDetail.dateCreate}</p>
      <p><strong>Status:</strong> {orderDetail.orderStatus}</p>
      
      <div className="update-status-section">
        <label htmlFor="status">Update Status:</label>
        <select id="status" value={newStatus} onChange={handleStatusChange}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={handleUpdateStatus}>Update Status</button>
      </div>
      
      <h3>Order Items</h3>
      <table className="order-items-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderDetail.orderDetails.map((item: { orderDetailId: React.Key | null | undefined; milkId: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; quantity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; total: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
            <tr key={item.orderDetailId}>
              <td>{item.milkId}</td>
              <td>{item.quantity}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailComponent;
