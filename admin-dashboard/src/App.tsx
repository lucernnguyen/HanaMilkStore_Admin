import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AddProduct from './components/AddProduct/AddProduct';
import Dashboard from './components/Dashboard/Dashboard';
import OrderDetails from './components/OrderDetail/OrderDetail';
import Orders from './components/OrderList/OrderList';
import ProductsSection from './components/ProductList/ProductList';
import CustomerList from './components/CustomerList/CustomerList';
import CustomerDetail from './components/CustomerDetail/CustomerDetail';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsSection />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order-details/:id" element={<OrderDetails />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customer-details/:id" element={<CustomerDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
