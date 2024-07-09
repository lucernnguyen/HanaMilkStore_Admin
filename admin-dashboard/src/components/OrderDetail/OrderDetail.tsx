import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../api/orderService';
import { OrderDetail, OrderItem } from '../../types/Order';

import './OrderDetail.css';
import { FaUser, FaCalendar, FaShoppingCart, FaMoneyBill } from 'react-icons/fa';
import StatsCard from '../StatsCard/StatsCard';
import productService from '../api/productService';
import { Product } from '../../types/Product';
import voucherService from '../api/voucherService';
import customerService from '../api/customerService';
import userService from '../api/userService';

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
          const member = await customerService.getCustomerById(order.memberId);
          const memberData = await userService.getUserById(member.userId);
          let voucherData = { title: 'không sử dụng', discount: 0 };
          if (order.voucherId) {
            voucherData = await voucherService.getVoucherById(order.voucherId);
          }
          const orderDetailsData = await Promise.all(order.orderDetails.map(item => orderService.getOrderDetailsById(item.orderDetailId)));

          const allMilks: Product[] = await productService.getAllProductsWithouFilter();

          const enrichedOrderDetailsData = orderDetailsData.map(detail => {
            const milk = allMilks.find(milk => milk.milkId === detail.milkId);
            const unitPrice = milk?.price ?? 0; // Đơn giá lấy từ milk hoặc mặc định là 0
            return {
              ...detail,
              productName: milk?.milkName ?? 'Unknown',
              productImage: milk?.milkPictures[0]?.picture ?? 'path/to/default-image.png',
              unitPrice,
              total: milk ? milk.price * detail.quantity : detail.total // tính lại total
            };
          });

          const initialAmount = enrichedOrderDetailsData.reduce((acc, detail) => acc + detail.total, 0); // tính tổng amount ban đầu
          const discountAmount = initialAmount * voucherData.discount; // tính tiền được giảm
          const payableAmount = initialAmount - discountAmount; // tính tiền phải trả

          const data = {
            ...order,
            memberData,
            voucherName: voucherData.title,
            voucherDiscount: voucherData.discount,
            orderDetails: enrichedOrderDetailsData,
            initialAmount, // thêm initialAmount
            discountAmount, // thêm discountAmount
            payableAmount, // thêm payableAmount
            address: memberData.address, // thêm địa chỉ
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
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
      <h2>Chi tiết đơn hàng</h2>

      <div className="stats-cards">
        <StatsCard color="#f54242" icon={FaUser} title="Tên khách hàng" value={orderDetail.memberName ?? 'Không xác định'} />
        <StatsCard color="#f5a442" icon={FaCalendar} title="Ngày đặt hàng" value={orderDetail.dateCreate} />
        <StatsCard color="#f5d142" icon={FaShoppingCart} title="Số lượng mặt hàng" value={itemsCount.toString()} />
        <StatsCard color="#42f554" icon={FaMoneyBill} title="Thành tiền" value={formatCurrency(orderDetail.payableAmount)} />
      </div>

      <h3>Địa chỉ</h3>
      <p>{orderDetail.address ?? 'N/A'}</p>
      <div className="order-items-status-container">
        <div className="order-items-container">
          <h3>Sản phẩm trong đơn hàng</h3>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th> {/* Đổi thành Thành tiền */}
              </tr>
            </thead>
            <tbody>
              {orderDetail.orderDetails.map((item: OrderItem) => (
                <tr key={item.orderDetailId}>
                  <td>{item.productName}</td>
                  <td><img src={item.productImage} alt={item.productName} width="50" height="50" /></td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td> {/* Tính và hiển thị đơn giá */}
                  <td>{formatCurrency(item.total)}</td> {/* Đổi thành total */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-status-container">
          <h3>Trạng thái đơn hàng</h3>
          <p><strong>Mã đơn hàng:</strong> {orderDetail.orderId}</p>
          <p><strong>Trạng thái:</strong> {orderDetail.orderStatus}</p>

          <div className="update-status-section">
            <label htmlFor="status">Cập nhật trạng thái:</label>
            <select id="status" value={newStatus} onChange={handleStatusChange}>
              <option value="">Chọn trạng thái</option>
              <option value="Pending">Đang chờ xử lý</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Shipped">Đã giao hàng</option>
              <option value="Delivered">Đã nhận hàng</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
            <button onClick={handleUpdateStatus}>Cập nhật</button>
          </div>
        </div>
      </div>
      <h3>Thành tiền</h3>
      <div className="amount-details">
        <p><strong>Tiền ban đầu:</strong> {formatCurrency(orderDetail.initialAmount)}</p>
        <p><strong>Tiền được giảm:</strong> {formatCurrency(orderDetail.discountAmount)}</p>
        <p><strong>Tiền phải trả:</strong> {formatCurrency(orderDetail.payableAmount)}</p>
      </div>
    </div>
  );
};

export default OrderDetailComponent;
