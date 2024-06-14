import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
    color: string;
    icon: string;
    title: string;
    value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ color, icon, title, value }) => {
    return (
        <div className={`stats-card ${color}`}>
            <div className="stats-icon">
                <img src={icon} alt="Icon" className="stats-icon" />
            </div>
            <div className="stats-content">
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;
