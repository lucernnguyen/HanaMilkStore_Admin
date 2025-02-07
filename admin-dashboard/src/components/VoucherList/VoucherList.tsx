import React, { useEffect, useState } from 'react';
import voucherService from '../api/voucherService';
import { Voucher } from '../../types/Voucher';
import './VoucherList.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from '@mui/material';

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statuses, setStatuses] = useState<{ voucherStatusId: number, voucherStatus: string }[]>([]);

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

    const fetchStatuses = async () => {
      try {
        // Giả sử bạn có một API để lấy tất cả các trạng thái voucher
        const statusData = await voucherService.getAllVoucherStatuses(); 
        setStatuses(statusData);
      } catch (error) {
        console.error('Error fetching statuses:', error);
        setStatuses([]);
      }
    };

    fetchVouchers();
    fetchStatuses();
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

  const handleEdit = (voucherId: number) => {
    const voucherToEdit = vouchers.find(voucher => voucher.voucherId === voucherId);
    if (voucherToEdit) {
      setEditVoucher(voucherToEdit);
      setEditDialogOpen(true);
    }
  };

  const handleEditChange = (field: keyof Voucher, value: string | number) => {
    if (editVoucher) {
      if (field === 'discount') {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (numericValue < 0.01 || numericValue > 1) {
          setError('Discount must be between 0.01 and 1');
          return;
        }
      }

      if (field === 'quantity') {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (numericValue < 0 || numericValue > 100) {
          setError('Quantity must be between 0 and 100');
          return;
        }
      }

      setEditVoucher({ ...editVoucher, [field]: value });
      setError(null); // Clear error when the value is valid
    }
  };

  const handleEditSave = async () => {
    if (editVoucher) {
      try {
        const voucherId = editVoucher.voucherId as number;
        await voucherService.updateVoucher(voucherId, editVoucher);
        const updatedVouchers = vouchers.map(voucher =>
          voucher.voucherId === editVoucher.voucherId ? editVoucher : voucher
        );
        setVouchers(updatedVouchers);
        setEditDialogOpen(false);
        setSuccess('Voucher updated successfully');
        setError(null);
      } catch (error) {
        console.error('Error updating voucher:', error);
        setError('Failed to update voucher. Please try again later.');
        setSuccess(null);
      }
    }
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find(status => status.voucherStatusId === statusId);
    return status ? status.voucherStatus : 'Unknown';
  };

  return (
    <div className="voucher-list-container">
      <h2>Danh sách mã giảm giá</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <table className="voucher-list-table">
        <thead>
          <tr>
            <th>Tên mã</th>
            <th>Chiết Khấu</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày hết hạn</th>
            <th>Trạng Thái</th>
            <th>Thao tác</th>
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
                <td>{getStatusName(voucher.voucherStatusId)}</td>
                <td>
                  {voucher.voucherId !== undefined && (
                    <>
                      <FaEdit className="icon-edit" onClick={() => handleEdit(voucher.voucherId!)} />
                      <FaTrashAlt className="icon-delete" onClick={() => handleDelete(voucher.voucherId)} />
                    </>
                  )}
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
        <button onClick={handlePreviousPage} disabled={page === 1}>Trang trước</button>
        <button onClick={handleNextPage} disabled={vouchers.length < pageSize}>Trang sau</button>
      </div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên mã"
            value={editVoucher?.title || ''}
            onChange={e => handleEditChange('title', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Ngày bắt đầu"
            type="datetime-local"
            value={editVoucher?.startDate || ''}
            onChange={e => handleEditChange('startDate', e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Ngày kết thúc"
            type="datetime-local"
            value={editVoucher?.endDate || ''}
            onChange={e => handleEditChange('endDate', e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Chiết khấu"
            value={editVoucher?.discount || ''}
            onChange={e => handleEditChange('discount', e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Số lượng"
            type="number"
            value={editVoucher?.quantity || 0}
            onChange={e => handleEditChange('quantity', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Trạng thái"
            value={editVoucher?.voucherStatusId || ''}
            onChange={e => handleEditChange('voucherStatusId', parseInt(e.target.value, 10))}
            select
            fullWidth
            margin="dense"
          >
            {statuses.map(status => (
              <MenuItem key={status.voucherStatusId} value={status.voucherStatusId}>{status.voucherStatus}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <div className="dialog-action-buttons">
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleEditSave} color="primary">Lưu</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default VoucherList;
