'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/config/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-700 hover:text-primary'
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
