import React from 'react';

interface MobileNavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
  external?: boolean;
}

const MobileNavigationLink = ({ 
  href, 
  children, 
  isScrolled, 
  onClick,
  external = false
}: MobileNavigationLinkProps) => {
  return (
    <a
      href={href}
      className={`
        block w-full text-left
        px-4 py-3
        text-sm font-medium
        ${isScrolled ? 'text-navy' : 'text-white'}
        hover:text-terracotta
        transition-colors duration-200
        rounded-lg
        focus:outline-none
        focus:ring-2
        focus:ring-terracotta
        focus:ring-offset-2
        focus:ring-offset-transparent
        active:bg-white/5
      `}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

export default MobileNavigationLink;
