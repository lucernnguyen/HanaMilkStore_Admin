// Voucher.ts
export interface Voucher {
  voucherId?: number;  // voucherId là tùy chọn
  title: string;
  startDate: string;
  endDate: string;
  discount: number;
  quantity: number;
  voucherStatusId: number;  // voucherStatusId là bắt buộc
}

export interface NewVoucher {
  title: string;
  startDate: string;
  endDate: string;
  discount: number;
  quantity: number;
  voucherStatusId: number;  // voucherStatusId là bắt buộc
}
