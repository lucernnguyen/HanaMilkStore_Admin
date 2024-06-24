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
  }
  
  export interface OrderDetail extends Order {
    items: OrderItem[];
  }
  
  export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }
  