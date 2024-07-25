import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const { userName, profilePicture } = user;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      <div className="page-title">
        <h1>{pageTitle}</h1>
      </div>
      <FontAwesomeIcon icon={faEnvelope} className="icon" />
      <FontAwesomeIcon icon={faBell} className="icon" />
      <div className="admin-info">
        <span className="admin-name">{userName || "Admin Name"}</span>
        <div className="admin-photo-container" onClick={toggleDropdown}>
          <img
            src={profilePicture || "path/to/default-photo.jpg"}
            alt="Admin"
            className="admin-photo"
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
