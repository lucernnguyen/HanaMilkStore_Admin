import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../api/orderService';
import statusService from '../api/statusService';
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
  const [statuses, setStatuses] = useState<{ statusId: number, status: string }[]>([]);

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
            const unitPrice = milk?.price ?? 0;
            return {
              ...detail,
              productName: milk?.milkName ?? 'Unknown',
              productImage: milk?.milkPictures[0]?.picture ?? 'path/to/default-image.png',
              unitPrice,
              total: milk ? milk.price * detail.quantity : detail.total
            };
          });

          const initialAmount = enrichedOrderDetailsData.reduce((acc, detail) => acc + detail.total, 0);
          const discountAmount = initialAmount * voucherData.discount;
          const payableAmount = initialAmount - discountAmount;

          const data = {
            ...order,
            memberName: memberData.userName,
            voucherName: voucherData.title,
            voucherDiscount: voucherData.discount,
            orderDetails: enrichedOrderDetailsData,
            initialAmount,
            discountAmount,
            payableAmount,
            address: memberData.address,
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

    const fetchStatuses = async () => {
      try {
        const data = await statusService.getAllStatuses();
        setStatuses(data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
        setStatuses([]);
      }
    };

    fetchOrderDetail();
    fetchStatuses();
  }, [id]);

  const handleConfirm = async () => {
    if (orderDetail) {
      try {
        await orderService.updateOrderStatus(orderDetail.orderId, 3, orderDetail.voucherId);
        const updatedOrderDetail = await orderService.getOrderById(orderDetail.orderId);
        setOrderDetail(updatedOrderDetail);
      } catch (error) {
        console.error('Error updating order status:', error);
        setError('Failed to confirm order. Please try again later.');
      }
    }
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find(status => status.statusId === statusId);
    return status ? status.status : 'Unknown';
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
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.orderDetails.map((item: OrderItem) => (
                <tr key={item.orderDetailId}>
                  <td>{item.productName}</td>
                  <td><img src={item.productImage} alt={item.productName} width="50" height="50" /></td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-status-container">
          <h3>Trạng thái đơn hàng</h3>
          <p><strong>Mã đơn hàng:</strong> {orderDetail.orderId}</p>
          <p><strong>Trạng thái:</strong> {getStatusName(orderDetail.statusId)}</p>

          {orderDetail.statusId === 1 && (
            <div className="confirm-section">
              <button onClick={handleConfirm}>Đồng ý</button>
            </div>
          )}
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
