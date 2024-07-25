import React, { useEffect, useState } from 'react';
import StatsCard from '../StatsCard/StatsCard';
import LatestOrders from '../LatestOrder/LatestOrder';
import NewCustomers from '../NewCustomer/NewCustomer';
import RevenueChart from '../RevenueChart/RevenueChart';
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
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orders, customers, products] = await Promise.all([
          orderService.getAllOrdersNoPagination(),
          customerService.getAllCustomers(),
          productService.getAllProductsWithouFilter()
        ]);

        const completedOrders = orders.filter((order: any) => order.statusId === 3 );

        const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + order.amount, 0);
        const totalCustomers = customers.length;
        const totalOrders = orders.length;
        const totalProducts = products.length;

        setStats({
          totalRevenue,
          totalCustomers,
          totalOrders,
          totalProducts
        });

        // Group completed orders by date and calculate total revenue for each date
        const revenueByDate = completedOrders.reduce((acc: any, order: any) => {
          const date = new Date(order.dateCreate).toLocaleDateString();
          if (!acc[date]) acc[date] = 0;
          acc[date] += order.amount;
          return acc;
        }, {});

        const labels = Object.keys(revenueByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const data = labels.map(date => revenueByDate[date]);

        setRevenueData({
          labels,
          datasets: [
            {
              label: 'Doanh thu',
              data,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)'
            }
          ]
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
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

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
          value={`${stats ? formatCurrency(stats.totalRevenue) : formatCurrency(0)}`}
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
        <div className="latest-orders">
          <LatestOrders />
        </div>
        <div className="revenue-and-customers">
          <RevenueChart data={revenueData} />
          <div className="new-customers">
            <NewCustomers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
