import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Header pageTitle="Dashboard" /> 
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
