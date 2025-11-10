import React, { useState } from 'react';

// --- Define Style Objects ---

// Based on .button
// Add the type annotation here
const buttonStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 18px',
  gap: '8px',
  width: '177px',
  height: '44px',
  background: '#181D27',
  border: '1px solid #181D27',
  borderRadius: '999px',
  boxShadow: '0px 1px 2px rgba(10, 13, 18, 0.05)',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  // This object is now checked against React.CSSProperties
};

// This is the .button:hover style
// Add the type annotation here too
const buttonHoverStyle: React.CSSProperties = {
  background: '#2a303c',
};

// Based on .text
// And here
const textStyle: React.CSSProperties = {
  height: '24px',
  fontFamily: "'Satoshi', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700, // This is a number, which is valid
  fontSize: '16px',
  lineHeight: '24px',
  color: '#FFFFFF',
  flex: 'none',
  order: 1, // This is a number, which is valid
  flexGrow: 0, // This is a number, which is valid
};

// Based on .icon
// And here
const iconStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  flex: 'none',
  order: 2, // This is a number, which is valid
  flexGrow: 0, // This is a number, which is valid
};

// --- Icon Component ---
const ArrowRightIcon = () => (
  <svg
    style={iconStyle} // Apply inline style
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16669 10H15.8334"
      stroke="white"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 4.16663L15.8333 9.99996L10 15.8333"
      stroke="white"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Main Button Component ---

const Button = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentStyle = isHovered
    ? { ...buttonStyle, ...buttonHoverStyle }
    : buttonStyle;

  return (
    <button
      // This line will no longer cause an error
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span style={textStyle}>{children}</span>
      <ArrowRightIcon />
    </button>
  );
};

export default Button;