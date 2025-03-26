import React from 'react';

interface AlertIconSVGProps {
  className?: string;
}

export const AlertIconSVG: React.FC<AlertIconSVGProps> = ({ className }) => {
    return (
      <svg className={className} width="61" height="56" viewBox="0 0 61 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_190_17034)">
          <g clipPath="url(#clip0_190_17034)">
            <rect x="4" y="3" width="4" height="48" fill="#0043CE"/>
            <path d="M32 16.5C29.9233 16.5 27.8932 17.1158 26.1665 18.2696C24.4398 19.4233 23.094 21.0632 22.2993 22.9818C21.5045 24.9004 21.2966 27.0116 21.7018 29.0484C22.1069 31.0852 23.1069 32.9562 24.5754 34.4246C26.0438 35.8931 27.9147 36.8931 29.9515 37.2982C31.9883 37.7034 34.0995 37.4955 36.0182 36.7007C37.9368 35.906 39.5767 34.5602 40.7304 32.8335C41.8842 31.1068 42.5 29.0767 42.5 27C42.5 24.2152 41.3937 21.5445 39.4246 19.5754C37.4555 17.6062 34.7848 16.5 32 16.5ZM32 21C32.2225 21 32.44 21.066 32.625 21.1896C32.81 21.3132 32.9542 21.4889 33.0394 21.6945C33.1245 21.9 33.1468 22.1262 33.1034 22.3445C33.06 22.5627 32.9528 22.7632 32.7955 22.9205C32.6382 23.0778 32.4377 23.185 32.2195 23.2284C32.0012 23.2718 31.775 23.2495 31.5695 23.1644C31.3639 23.0792 31.1882 22.935 31.0646 22.75C30.941 22.565 30.875 22.3475 30.875 22.125C30.875 21.8266 30.9935 21.5405 31.2045 21.3295C31.4155 21.1185 31.7016 21 32 21ZM35 33.0938H29V31.4062H31.1562V27.0938H29.75V25.4062H32.8437V31.4062H35V33.0938Z" fill="#0043CE"/>
          </g>
        </g>
        <defs>
          <filter id="filter0_d_190_17034" x="0" y="0" width="61" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0705882 0 0 0 0 0.0862745 0 0 0 0 0.0980392 0 0 0 0.16 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_190_17034"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_190_17034" result="shape"/>
          </filter>
          <clipPath id="clip0_190_17034">
            <rect x="4" y="3" width="53" height="48" rx="4" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    );
  };