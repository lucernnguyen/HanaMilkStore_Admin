import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import logo from 'E:/SWP391/demowed/Admin_React/admin-dashboard/src/dep2.png'; 
const Sidebar: React.FC = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul>
        <li>
          <Link to="/">Homepage</Link>
        </li>
        <li>
          <div className="dropdown" onClick={toggleProductDropdown}>
            Product
          </div>
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
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li><Link to="/customers">Customers</Link></li>
        <li>
          <div className="dropdown" onClick={toggleProductDropdown}>
            Voucher
          </div>
          {isProductDropdownOpen && (
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
      </ul>
    </div>
  );
};

export default Sidebar;
