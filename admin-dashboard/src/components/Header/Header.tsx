import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <div className="header">
            <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input" />
                <button className="search-button">Tìm</button>
            </div>
            <img src="path/to/mail-icon.png" alt="Mail Icon" className="icon" />
            <img src="path/to/notification-icon.png" alt="Notification Icon" className="icon" />
            <div className="admin-info">
                <span className="admin-name">Admin Name</span>
                <img src="path/to/admin-photo.jpg" alt="Admin Photo" className="admin-photo" />
            </div>
        </div>
    );
};

export default Header;
