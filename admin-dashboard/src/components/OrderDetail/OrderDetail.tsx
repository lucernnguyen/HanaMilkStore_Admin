import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../api/orderService';
import { OrderDetail, OrderItem } from '../../types/Order';

import './OrderDetail.css';
import { FaUser, FaCalendar, FaShoppingCart, FaMoneyBill } from 'react-icons/fa';
import StatsCard from '../StatsCard/StatsCard';
import productService from '../api/productService';
import { Product } from '../../types/Product';

const OrderDetailComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const order = await orderService.getOrderById(Number(id));

        if (order && order.orderDetails) {
          const memberData = await orderService.getMemberNameById(order.memberId);
          let voucherData = 'không sử dụng';
            if (order.voucherId) {
              voucherData = await orderService.getVoucherNameById(order.voucherId);
            }
          const orderDetailsData = await Promise.all(order.orderDetails.map(item => orderService.getOrderDetailsById(item.orderDetailId)));

          const allMilks: Product[] = await productService.getAllProductsWithouFilter();

          const enrichedOrderDetailsData = orderDetailsData.map(detail => {
            const milk = allMilks.find(milk => milk.milkId === detail.milkId);
            return {
              ...detail,
              productName: milk?.milkName ?? 'Unknown',
              productImage: milk?.milkPictures[0]?.picture ?? 'path/to/default-image.png',
              total: milk ? milk.price * detail.quantity : detail.total // tính lại total
            };
          });

          const totalAmount = enrichedOrderDetailsData.reduce((acc, detail) => acc + detail.total, 0); // tính tổng amount

          const data = {
            ...order,
            memberName: memberData,
            voucherName: voucherData,
            orderDetails: enrichedOrderDetailsData,
            amount: totalAmount, // cập nhật amount
          };

          setOrderDetail(data as OrderDetail);
        } else {
          console.error('No order found with the provided id');
          setError('No order found with the provided id. Please check the id and try again.');
        }
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

  const itemsCount = orderDetail.orderDetails.length;

  return (
    <div className="order-detail-container">
      <h2>Order Detail</h2>

      <div className="stats-cards">
        <StatsCard color="#f54242" icon={FaUser} title="Customer Name" value={orderDetail.memberName ?? 'Unknown'} />
        <StatsCard color="#f5a442" icon={FaCalendar} title="Order Date" value={orderDetail.dateCreate} />
        <StatsCard color="#f5d142" icon={FaShoppingCart} title="Items Count" value={itemsCount.toString()} />
        <StatsCard color="#42f554" icon={FaMoneyBill} title="Total Amount" value={orderDetail.amount.toString()} />
      </div>

      <h3>Address</h3>
      <p>{orderDetail.address ?? 'N/A'}</p>
      <div className="order-items-status-container">
        <div className="order-items-container">
          <h3>Order Items</h3>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Quantity</th>
                <th>Total</th> {/* Đổi thành Total */}
              </tr>
            </thead>
            <tbody>
              {orderDetail.orderDetails.map((item: OrderItem) => (
                <tr key={item.orderDetailId}>
                  <td>{item.productName}</td>
                  <td><img src={item.productImage} alt={item.productName} width="50" height="50" /></td>
                  <td>{item.quantity}</td>
                  <td>{item.total.toLocaleString('vi-VN')}</td> {/* Đổi thành total */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-status-container">
          <h3>Order Status</h3>
          <p><strong>Order ID:</strong> {orderDetail.orderId}</p>
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
        </div>
      </div>
      <h3>Total Amount</h3>
      <p>{orderDetail.amount.toLocaleString('vi-VN')}</p> {/* Hiển thị total amount */}
    </div>
  );
};

export default OrderDetailComponent;
