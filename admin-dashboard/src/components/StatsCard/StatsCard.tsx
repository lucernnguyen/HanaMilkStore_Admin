// StatsCard.tsx
import React from 'react';
import { IconType } from 'react-icons';
import './StatsCard.css';

interface StatsCardProps {
  color: string;
  icon: IconType;
  title: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ color, icon: Icon, title, value }) => {
  return (
    <div className="stats-card">
      <div className="icon-container" style={{ backgroundColor: color }}>
        <Icon color="#fff" />
      </div>
      <div className="stats-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
