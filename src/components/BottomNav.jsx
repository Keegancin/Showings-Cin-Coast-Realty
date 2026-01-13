import React from 'react';
import clsx from 'clsx';

const BottomNav = ({ items, activeItem, onNavigate }) => {
  return (
    <div className="rounded-xl p-1 flex justify-around items-center bg-brand-gray border border-brand-border">
      {items.map((item) => {
        const isActive = activeItem === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={clsx(
              'flex flex-col items-center px-2 py-1.5 rounded-lg min-w-0 transition-all touch-feedback',
              isActive && 'scale-105'
            )}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: isActive ? '#c9a96e' : '#888888' }}
            />
            <span
              className="text-[9px] font-medium mt-0.5"
              style={{ color: isActive ? '#c9a96e' : '#888888' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
