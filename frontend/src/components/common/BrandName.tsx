import React from 'react';

interface BrandNameProps {
  className?: string;
  eClassName?: string;
}

export const BrandName: React.FC<BrandNameProps> = ({ 
  className = '', 
  eClassName = 'text-[0.65em] font-mono text-[#E5A866] relative -top-[0.45em] ml-0.5 font-semibold' 
}) => {
  return (
    <span className={`inline-flex items-baseline font-display ${className}`}>
      <span>ON</span>
      <sup className={eClassName}>e</sup>
    </span>
  );
};
