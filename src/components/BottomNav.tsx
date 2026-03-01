import { NavLink } from 'react-router-dom';
import { Car, Ship, Receipt, ShoppingBag, CheckSquare, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', icon: Car, label: '行程' },
  { path: '/bookings', icon: Ship, label: '預訂' },
  { path: '/expense', icon: Receipt, label: '記帳' },
  { path: '/lists', icon: ShoppingBag, label: '清單' },
  { path: '/planning', icon: CheckSquare, label: '準備' },
  { path: '/members', icon: Users, label: '成員' },
];

export function BottomNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const filteredNavItems = isAuthenticated 
    ? navItems 
    : navItems.filter(item => item.path === '/members');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#E0E5D5] pb-safe pt-2 px-4 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center p-2 rounded-xl transition-all duration-200 active:scale-95",
                  isActive ? "text-[#8FB7D3]" : "text-ac-text-light hover:text-ac-text"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-2 rounded-full transition-colors",
                    isActive ? "bg-[#8FB7D3]/10" : "bg-transparent"
                  )}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-bold mt-1">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
