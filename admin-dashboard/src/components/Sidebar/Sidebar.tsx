import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isVoucherDropdownOpen, setIsVoucherDropdownOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userRole = user?.roleId;

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const toggleVoucherDropdown = () => {
    setIsVoucherDropdownOpen(!isVoucherDropdownOpen);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="https://firebasestorage.googleapis.com/v0/b/imageuploadv3.appspot.com/o/Logo%20Footer%2Fdep2.png?alt=media&token=08b080e1-c883-4c89-ba4f-76f8f0a57b00" width="150" height="150" alt="Logo" />
      </div>
      <ul>
        <li>
          <Link to="/">Homepage</Link>
        </li>
        {userRole && [1, 2].includes(userRole) && (
          <li>
            <button className="dropdown-toggle" onClick={toggleProductDropdown}>
              Product
            </button>
            {isProductDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/products">Quản lý sản phẩm</Link>
                </li>
                <li>
                  <Link to="/add-product">Thêm sản phẩm</Link>
                </li>
              </ul>
            )}
          </li>
        )}
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        {userRole && userRole === 1 && (
          <li>
            <Link to="/customers">Customers</Link>
          </li>
        )}
        {userRole && [1, 2].includes(userRole) && (
          <li>
            <button className="dropdown-toggle" onClick={toggleVoucherDropdown}>
              Voucher
            </button>
            {isVoucherDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/vouchers">Quản lý voucher</Link>
                </li>
                <li>
                  <Link to="/add-voucher">Thêm voucher</Link>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
