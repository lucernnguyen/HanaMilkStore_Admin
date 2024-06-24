// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import StatsCard from '../StatsCard/StatsCard';
import LatestOrders from '../LatestOrder/LatestOrder';
import NewCustomers from '../NewCustomer/NewCustomer';
import { FaDollarSign, FaUsers, FaClipboardList, FaBoxOpen } from 'react-icons/fa';

import './Dashboard.css';
import customerService from '../api/customerService';
import orderService from '../api/orderService';
import productService from '../api/productService';

interface Stats {
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orders, customers, products] = await Promise.all([
          orderService.getAllOrders(),
          customerService.getAllCustomers(),
          productService.getAllProductsWithouFilter()
        ]);

        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.amount, 0);
        const totalCustomers = customers.length;
        const totalOrders = orders.length;
        const totalProducts = products.length;

        setStats({
          totalRevenue,
          totalCustomers,
          totalOrders,
          totalProducts
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to fetch stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="main-content">
      <div className="stats-cards">
        <StatsCard 
          color="green" 
          icon={FaDollarSign}  
          title="Tổng doanh thu" 
          value={`$${stats ? stats.totalRevenue : 0}`} 
        />
        <StatsCard 
          color="pink" 
          icon={FaUsers}  
          title="Tổng số khách hàng" 
          value={stats ? stats.totalCustomers.toString() : '0'} 
        />
        <StatsCard 
          color="yellow" 
          icon={FaClipboardList}  
          title="Tổng số đơn đặt hàng" 
          value={stats ? stats.totalOrders.toString() : '0'} 
        />
        <StatsCard 
          color="blue" 
          icon={FaBoxOpen}  
          title="Tổng số sản phẩm" 
          value={stats ? stats.totalProducts.toString() : '0'} 
        />
      </div>
      <div className="dashboard-content">
        <LatestOrders />
        <NewCustomers />
      </div>
    </div>
  );
};

export default Dashboard;
