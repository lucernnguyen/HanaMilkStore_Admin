// src/types/Order.ts
export interface Order {
    orderId: number;
    memberId: number;
    memberName: string;
    voucherId: number;
    voucherName: string;
    dateCreate: string;
    amount: number;
    orderStatus: string;
    customerName?: string; // Thêm thuộc tính này để lưu tên khách hàng
    itemsCount?: number; // Thêm thuộc tính này để lưu số lượng sản phẩm
  }
  
  export interface OrderDetail extends Order {
    orderDetails: any;
    items: OrderItem[];
  }
  
  export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }
  