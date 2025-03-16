import { Outlet } from "react-router-dom";
import { Navbar } from "./Shared/MainNav";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container flex h-16 items-center max-w-screen-xl mx-auto px-4">
          <Navbar />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © 2025 Crime Record Management System | All Rights Reserved | Terms
            of Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
