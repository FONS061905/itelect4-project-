import { NavLink, Outlet } from "react-router";
import useToggle from "../hooks/useToggle";
import useAuthStore from "../store/authStore";

function Layout() {
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const base = "rounded px-3 py-1.5 text-sm";
  const activeLink = `${base} bg-blue-600 font-semibold text-white`;
  const idleLink = `${base} text-gray-700 hover:bg-gray-200 dark:text-gray-300`;

  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? activeLink : idleLink;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <span className="mr-4 font-bold text-gray-900 dark:text-white">Lost &amp; Found</span>
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/items" className={linkClass}>Items</NavLink>
          <NavLink to="/users" className={linkClass}>Users</NavLink>
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>

          {user === null ? (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          ) : (
            <button
              onClick={logout}
              className="rounded px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300"
            >
              Logout ({user.name})
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="ml-auto rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
