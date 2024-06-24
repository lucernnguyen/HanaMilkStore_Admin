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

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsSection />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="order-detail/:id" element={<OrderDetail />} /> {/* Use correct import */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="customer-details/:id" element={<CustomerDetail />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
