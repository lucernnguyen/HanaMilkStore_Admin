import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell } from '@fortawesome/free-solid-svg-icons';
interface HeaderProps {
    pageTitle: string;
}
const Header: React.FC<HeaderProps> = ({ pageTitle }) => {    return (
        <div className="header">
            <div className="page-title">
                <h1>{pageTitle}</h1>
            </div>
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <FontAwesomeIcon icon={faBell} className="icon" />
            <div className="admin-info">
                <span className="admin-name">Admin Name</span>
                <img src="path/to/admin-photo.jpg" alt="Admin" className="admin-photo" />
            </div>
        </div>
    );
};

export default Header;
