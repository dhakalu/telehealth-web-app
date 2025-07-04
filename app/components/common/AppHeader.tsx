import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { User } from "~/routes/provider/complete-profile";

export interface AppHeaderProps {
  links?: { label: string; href: string }[];
  user?: User;
}

const AppHeader: React.FC<AppHeaderProps> = ({ links, user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <header className="navbar flex bg-base-300 shadow-sm w-full lg:pl-10 pr-4">
          <div className="flex-none nav-start lg:hidden">
            <label aria-label="open sidebar" htmlFor="my-drawer-3" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </label>
          </div>
          <div>
            <a href="/login" className="font-bold text-lg tracking-wide">
              <img src="/logo.png" alt="MedToc Logo" className="inline-block w-8 h-8 rounded-full mr-2 align-middle" />
              MedToc
            </a>
          </div>
          <div className="nav-center flex-1 hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {(links || []).map((link) => {
                const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <a
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex-none hidden lg:flex nav-end">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="ml-2 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Profile"
                  type="button"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-56  bg-base-100 rounded shadow-lg z-50 p-4 min-w-[180px]">
                    <div className="mb-2 font-semibold">{user.given_name} {user.family_name}</div>
                    {user.email && <div className="mb-2 text-sm opacity-60 truncate">{user.email}</div>}
                    <a href={`/logout?appPath=${user.account_type}`} className="block text-blue-600 hover:underline text-sm mt-2">Logout</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </header >
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-base-200 min-h-full w-80 p-4">
          <div className="flex gap-3">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-12 h-12 rounded-full">
                <img alt="Profile" src="https://placehold.co/12" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold">{user?.given_name} {user?.family_name}</div>
              <div className="text-sm opacity-60 truncate">{user?.email}</div>
            </div>
          </div>
          <div className="divider" />
          <ul>
            {(links || []).map((link) => (
              <li className="p-1" key={link.href}>
                <a
                  key={link.href}
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>))}
            <div className="divider" />
            <li className="p-1"><a href={`/logout?appPath=${user?.account_type}`} className="block text-blue-600 hover:underline text-sm mt-2">Logout</a></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AppHeader;
