import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AddProduct from './components/AddProduct/AddProduct';
import Dashboard from './components/Dashboard/Dashboard';
import ProductsSection from './components/ProductList/ProductList';
import CustomerList from './components/CustomerList/CustomerList';
import CustomerDetail from './components/CustomerDetail/CustomerDetail';
import EditProduct from './components/EditProduct/EditProduct';
import OrderList from './components/OrderList/OrderList';
import OrderDetail from './components/OrderDetail/OrderDetail';
import VoucherList from './components/VoucherList/VoucherList';
import AddVoucher from './components/AddVoucher/AddVoucher';
import Login from './components/Login/Login';
import PrivateRoute from './PrivateRoute';
import Unauthorized from './Unauthorized';

const App: React.FC = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAuthenticated = !!user?.roleId;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsSection />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="order-detail/:id" element={<OrderDetail />} />
        <Route path="vouchers" element={<VoucherList />} />
        <Route path="add-voucher" element={<AddVoucher />} />
        <Route path="customers" element={<PrivateRoute allowedRoles={[1]} />}>
          <Route index element={<CustomerList />} />
          <Route path="customer-details/:memberId" element={<CustomerDetail />} />
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route for unknown paths */}
    </Routes>
  );
};

export default App;
