// VoucherList.tsx
import React, { useEffect, useState } from 'react';
import voucherService from '../api/voucherService';
import { Voucher } from '../../types/Voucher';
import './VoucherList.css';

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await voucherService.getAllVouchers(page, pageSize);
        setVouchers(data || []);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setVouchers([]);
      }
    };

    fetchVouchers();
  }, [page]);

  const handleDelete = async (voucherId: number | undefined) => {
    if (voucherId === undefined) {
      setError('Invalid voucher ID');
      return;
    }

    try {
      await voucherService.deleteVoucher(voucherId);
      setVouchers(vouchers.filter(voucher => voucher.voucherId !== voucherId));
      setSuccess('Voucher deleted successfully');
      setError(null);
    } catch (error) {
      console.error('Error deleting voucher:', error);
      setError('Failed to delete voucher. Please try again later.');
      setSuccess(null);
    }
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="voucher-list-container">
      <h2>Voucher List</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <table className="voucher-list-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Discount</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.length > 0 ? (
            vouchers.map(voucher => (
              <tr key={voucher.voucherId}>
                <td>{voucher.title}</td>
                <td>{voucher.discount}</td>
                <td>{voucher.startDate}</td>
                <td>{voucher.endDate}</td>
                <td>{voucher.status}</td>
                <td>
                  <button onClick={() => handleDelete(voucher.voucherId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No vouchers available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default VoucherList;
