import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Dashboard from './Dashboard/Dashboard';

import AddProduct from './AddProduct/AddProduct';
import ProductsSection from './ProductList/ProductList';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsSection />} />
                    <Route path="add-product" element={<AddProduct />} />
                    {/* Thêm các tuyến đường khác tại đây */}
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
