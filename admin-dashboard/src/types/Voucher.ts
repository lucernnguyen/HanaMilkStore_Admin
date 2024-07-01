// Voucher.ts
export interface Voucher {
  voucherId?: number; // Making voucherId optional
  title: string;
  startDate: string;
  endDate: string;
  discount: number;
  quantity: number;
  status: string;
}

export interface NewVoucher {
  title: string;
  startDate: string;
  endDate: string;
  discount: number;
  quantity: number;
  status: string;
}
