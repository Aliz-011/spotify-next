import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons/lib';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  active,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `
          flex 
          flex-row 
          item-center 
          h-auto w-full 
          gap-x-4 font-medium 
          cursor-pointer hover:text-white 
          transition text-neutral-400 py-1
        `,
        active && 'text-white'
      )}
    >
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
