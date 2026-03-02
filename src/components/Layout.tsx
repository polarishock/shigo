import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

const Header = () => (
  <header className="relative h-28 w-full overflow-hidden bg-[#E3F2FD] border-b-2 border-[#E0E5D5]">
    <img 
      src="./banner.jpg" 
      alt="Shikoku Banner"
      className="w-full h-full object-cover object-center"
    />
  </header>
);

export function Layout() {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-ac-bg/50 shadow-2xl overflow-hidden relative">
      <Header />
      
      <main className="p-4">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}
