'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              Logo
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-gray-900"
              >
                Sair
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 