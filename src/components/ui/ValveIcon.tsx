import React, { useState, useEffect } from 'react';
import './ValveIcon.css';

interface ValveIconProps {
  isOpen?: boolean;
  size?: number;
  className?: string;
  animationDuration?: number;
  onToggle?: (isOpen: boolean) => void;
}

const ValveIcon: React.FC<ValveIconProps> = ({
  isOpen = false,
  size = 512,
  className = '',
  animationDuration = 500,
  onToggle
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  const handleClick = () => {
    const newState = !internalIsOpen;
    setInternalIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <svg
      className={`valve-icon ${internalIsOpen ? 'valve-open' : 'valve-closed'} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      onClick={handleClick}
      style={{ 
        '--animation-duration': `${animationDuration}ms`,
        cursor: 'pointer'
      } as React.CSSProperties}
    >
      <g transform="translate(0, 512) scale(0.1, -0.1)">
        {/* Корпус клапана - всегда виден */}
        <path
          className="valve-body"
          d="M2000 2646 l0 -156 -52 -26 c-63 -32 -155 -93 -203 -136 -25 -21 -36
          -26 -39 -16 -42 144 -118 227 -240 263 -77 23 -533 21 -598 -3 -130 -47 -208
          -146 -233 -294 l-6 -38 -314 0 -315 0 0 -885 0 -885 317 -2 318 -3 7 -48 c15
          -108 96 -215 196 -260 67 -29 294 -44 484 -30 163 11 215 30 289 104 41 41 89
          128 89 162 0 26 16 21 75 -27 224 -183 572 -285 874 -256 272 26 492 117 700
          290 l59 49 7 -37 c18 -104 90 -199 187 -248 46 -24 72 -29 200 -37 192 -14
          412 0 480 30 99 45 181 152 196 260 l7 48 318 3 317 2 0 885 0 885 -315 0
          -314 0 -6 38 c-19 113 -63 189 -142 246 -86 63 -118 68 -414 64 -260 -3 -265
          -3 -319 -29 -98 -46 -176 -147 -195 -251 l-7 -36 -86 67 c-48 38 -124 90 -169
          116 l-83 48 0 147 0 147 -52 -13 c-38 -10 -120 -14 -293 -13 -305 2 -673 14
          -702 24 l-23 7 0 -156z"
        />
        
        {/* Рукоятка клапана - анимируется */}
        <g className="valve-handle-group">
          <path
            className="valve-handle"
            d="M2467 5006 c-57 -21 -103 -61 -126 -109 -17 -35 -21 -62 -21 -140 l0
            -97 -640 0 c-422 0 -656 -4 -690 -11 -73 -16 -137 -63 -174 -129 -27 -48 -31
            -65 -31 -130 0 -57 6 -85 22 -116 24 -45 89 -108 131 -127 20 -9 206 -13 702
            -17 l675 -5 3 -157 3 -158 148 0 c81 0 182 3 224 6 l77 7 0 153 0 154 663 0
            c512 1 670 4 698 14 62 22 107 64 140 132 28 55 31 71 27 127 -5 81 -40 151
            -96 194 -83 63 -79 63 -789 63 l-643 0 0 73 c-1 94 -12 141 -47 191 -54 77
            -170 114 -256 82z"
          />
        </g>
      </g>
    </svg>
  );
};

export default ValveIcon;