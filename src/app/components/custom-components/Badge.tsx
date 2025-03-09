import React from 'react';

interface BadgeProps {
  backgroundColor: string;
  color: string;
  text: string;
  onClose: () => void;

}

const Badge: React.FC<BadgeProps> = ({ backgroundColor, color, text,onClose }) => {
  const [key, value] = text.split(': ');

  return (
    <div className="custom-badge" style={{ backgroundColor, color }}>
      {key} -  <span className="custom-badge-value">{value}</span>
      <div className="badge-close" onClick={onClose}>×</div>

    </div>
  );
};

export default Badge;