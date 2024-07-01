import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import voucherService from '../api/voucherService';
import './AddVoucher.css';

const AddVoucher: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [status, setStatus] = useState('ACTIVE');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate || !endDate || !discount || !quantity) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
      return;
    }

    const newVoucher = {
      title,
      startDate,
      endDate,
      discount,
      quantity,
      status,
    };

    try {
      await voucherService.createVoucher(newVoucher);
      navigate('/vouchers');
    } catch (error) {
      setError('Có lỗi xảy ra khi thêm voucher.');
    }
  };

  return (
    <div className="add-voucher-container">
      <h2>Thêm Voucher</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <label>
              Tên Voucher:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Ngày Bắt Đầu:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              Ngày Kết Thúc:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-column">
            <label>
              Giảm Giá (%):
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                required
              />
            </label>
            <label>
              Số Lượng:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </label>
            <label>
              Trạng Thái:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DISABLE">DISABLE</option>
              </select>
            </label>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Thêm Voucher</button>
      </form>
    </div>
  );
};

export default AddVoucher;
