// src/types/Order.ts

export interface Order {
  orderId: number;
  memberId: number;
  memberName?: string; // Thêm ? để memberName có thể là optional
  voucherId: number;
  voucherName?: string; // Thêm ? để voucherName có thể là optional
  dateCreate: string;
  amount: number;
  orderStatus: string;
  address?: string; // Địa chỉ của khách hàng
  orderDetails: OrderItem[]; // Danh sách chi tiết đơn hàng
  itemsCount?: number; // Số lượng sản phẩm trong đơn hàng
}

export interface OrderDetail extends Order {
  // Các thuộc tính đặc biệt của OrderDetail nếu cần
  initialAmount: number; // 
  discountAmount: number; // 
  payableAmount: number;
}

export interface OrderItem {
  orderDetailId: number;
  orderId: number;
  milkId: number;
  productName?: string; // Thêm tên sản phẩm
  productImage?: string; // Thêm ảnh sản phẩm
  quantity: number;
  unitPrice: number; // Giá sản phẩm (có thể là optional)
  total: number;
}
