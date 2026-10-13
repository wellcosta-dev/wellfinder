import React from 'react';

interface CountryFlagProps {
  countryCode?: string;
  countryName?: string;
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  countryName = '',
  className = 'w-6 h-4'
}) => {
  if (!countryCode || countryCode === 'N/A' || countryCode === 'Unknown') {
    return <span className="text-base select-none">🌐</span>;
  }

  const code = countryCode.toLowerCase().trim();

  // If code is not 2 letters, fallback
  if (code.length !== 2) {
    return <span className="text-base select-none">🌐</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/32x24/${code}.png`}
      srcSet={`https://flagcdn.com/64x48/${code}.png 2x`}
      alt={countryName || countryCode}
      title={countryName || countryCode}
      className={`inline-block object-cover rounded-[2px] shadow-sm flex-shrink-0 ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to text label if network fails
        const target = e.target as HTMLElement;
        target.style.display = 'none';
      }}
    />
  );
};
