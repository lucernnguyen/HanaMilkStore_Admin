import React from 'react';
import StatsCard from '../StatsCard/StatsCard';
import LatestOrders from '../LatestOrder/LatestOrder';
import NewCustomers from '../NewCustomer/NewCustomer';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (

        <div className="main-content">
            <div className="stats-cards">
                <StatsCard color="green" icon="path/to/icon.png" title="Tổng doanh thu" value="$10,000" />
                <StatsCard color="pink" icon="path/to/icon.png" title="Tổng số khách hàng" value="200" />
                <StatsCard color="yellow" icon="path/to/icon.png" title="Tổng số đơn đặt hàng" value="150" />
                <StatsCard color="blue" icon="path/to/icon.png" title="Tổng số sản phẩm" value="300" />
            </div>
            <div className="dashboard-content">
                <LatestOrders />
                <NewCustomers />
            </div>
        </div>

    );
};

export default Dashboard;