import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDetail.css';
import { Member, User } from '../../types/User';
import userService from '../api/userService';
import customerService from '../api/customerService';
import statusService from '../api/statusService'; // Import statusService
import orderService from '../api/orderService'; // Import orderService
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon

const CustomerDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // State for success message
  const [statusFilter, setStatusFilter] = useState<number>(0); // State for status filter
  const [statuses, setStatuses] = useState<{ statusId: number, status: string }[]>([]); // State for statuses

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const memberData: Member = await customerService.getCustomerById(Number(memberId));
        setMember(memberData);

        const userData: User = await userService.getUserById(memberData.userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setError('Failed to fetch member details. Please try again later.');
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

    fetchMemberDetails();
    fetchStatuses();
  }, [memberId]);

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatusId = parseInt(e.target.value, 10);
    setStatusFilter(selectedStatusId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleDelete = async () => {
    if (!member) return;

    console.log('Bắt đầu quá trình xóa.');

    // Check for incomplete orders
    const incompleteOrders = member.orders.some(order => order.statusId === 1 || order.statusId === 4);
    if (incompleteOrders) {
        console.log('Có đơn hàng chưa hoàn thành.');
        setError('Còn đơn hàng chưa hoàn thành, không thể xóa.');
        return;
    }

    try {
        // Delete order details first
        for (const order of member.orders) {
            console.log(`Xử lý đơn hàng với ID: ${order.orderId}`);
            
            // Fetch order details by orderId
            const fetchedOrder = await orderService.getOrderById(order.orderId);
            console.log(`Đã lấy chi tiết đơn hàng: ${JSON.stringify(fetchedOrder)}`);

            if (fetchedOrder.orderDetails.length > 0) {
                console.log(`Tìm thấy ${fetchedOrder.orderDetails.length} chi tiết đơn hàng.`);
                for (const orderDetail of fetchedOrder.orderDetails) {
                    console.log(`Xóa chi tiết đơn hàng với ID: ${orderDetail.orderDetailId}`);
                    await orderService.deleteOrderDetail(orderDetail.orderDetailId);
                }
            }

            // Delete orders only if there are no order details
            if (fetchedOrder.orderDetails.length === 0) {
                console.log(`Xóa đơn hàng với ID: ${order.orderId}`);
                await orderService.deleteOrder(order.orderId);
            }
        }

        // After deleting all orders, get and delete comments
        const allComments = await orderService.getAllComments();
        console.log(`Đã lấy tất cả bình luận: ${JSON.stringify(allComments)}`);

        for (const comment of allComments) {
            if (comment.memberId === member.memberId) {
                console.log(`Xóa bình luận với ID: ${comment.commentId}`);
                await orderService.deleteComment(comment.commentId);
            }
        }

        // Delete member only if there are no orders
        const remainingOrders = member.orders.filter(order => order.orderDetails.length > 0);
        if (remainingOrders.length === 0) {
            console.log(`Xóa khách hàng với ID: ${member.memberId}`);
            await customerService.deleteCustomer(member.memberId);
        }

        // Delete user after deleting the member
        if (remainingOrders.length === 0) {
            console.log(`Xóa người dùng với ID: ${user?.userId!}`);
            await userService.deleteUser(user?.userId!);
        }

        // After deletion, handle UI updates
        console.log('Xóa thành công.');
        setMember(null);
        setUser(null);
        setSuccess('Xóa thành công.');
        setError(null);
    } catch (error) {
        console.error('Lỗi khi xóa khách hàng:', error);
        setError('Không thể xóa thành viên. Vui lòng thử lại sau.');
        setSuccess(null);
    }
};




  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!member || !user) {
    return <div className="error">Member details not found.</div>;
  }

  const filteredOrders = statusFilter === 0 
    ? member.orders 
    : member.orders.filter(order => order.statusId === statusFilter);

  const getStatusName = (statusId: number) => {
    const status = statuses.find(status => status.statusId === statusId);
    return status ? status.status : 'Unknown';
  };

  return (
    <div className="customer-detail-container">
      <h1>Chi tiết thành viên</h1>
      <div className="card">
        <div className="user-info">
          <h2>{user.userName}</h2>
          <p>Điện thoại: {user.phone}</p>
          <p>Địa chỉ: {user.address}</p>
          <p>Ngày đăng ký: {user.dateCreate}</p>
          <FaTrashAlt className="icon-delete" onClick={handleDelete} />
        </div>
        {user.profilePicture && (
          <div className="profile-picture">
            <img src={user.profilePicture} alt={`${user.userName}'s profile`} />
          </div>
        )}
      </div>
      <h2>Đơn hàng</h2>
      <div className="status-filter">
        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
        <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="0">Tất cả</option>
          {statuses.map(status => (
            <option key={status.statusId} value={status.statusId}>{status.status}</option>
          ))}
        </select>
      </div>
      {success && <p className="success">{success}</p>}
      <table>
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Ngày</th>
            <th>Giỏ hàng</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.dateCreate}</td>
              <td>
                <Link to={`/order-detail/${order.orderId}`}>Xem chi tiết</Link>
              </td>
              <td>{formatCurrency(order.amount)}</td>
              <td>{getStatusName(order.statusId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetail;
