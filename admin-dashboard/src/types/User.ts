import { Order } from "./Order";
export interface User {
    userId: number;
    userName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    roleId: number;
    profilePicture: string;
    dateCreate: string;
  }
  
  export interface Customer {
    memberId: number;
    userId: number;
    description: string;
    userDetails?: User; // Thêm chi tiết người dùng vào Customer
  }
  export interface Member {
    memberId: number;
    userId: number;
    desciption: string;
    orders: Order[]; // Include the orders property
  }