import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { User } from "~/routes/provider/complete-profile";

interface AppHeaderProps {
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
    <header className="w-full bg-blue-700 text-white py-4 px-6 rounded-t shadow flex items-center justify-between">
      <a href="/login" className="font-bold text-lg tracking-wide">
        <img src="/logo.png" alt="MedToc Logo" className="inline-block w-8 h-8 rounded-full mr-2 align-middle" />
        MedToc
      </a>
      <div className="flex items-center gap-4">
        {(links || []).map((link, idx) => {
          const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
          return (
            <a
              key={link.href}
              href={link.href}
              className={
                (isActive
                  ? "text-blue-200 underline font-bold "
                  : "hover:underline ") +
                (idx < (links?.length || 2) - 1 ? "mr-4" : "")
              }
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </a>
          );
        })}
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
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded shadow-lg z-50 p-4 min-w-[180px]">
                <div className="mb-2 font-semibold">{user.name || user.email}</div>
                {user.email && <div className="mb-2 text-sm text-gray-600">{user.email}</div>}
                <hr className="my-2" />
                <a href={`/logout?appPath=${user.account_type}`} className="block text-blue-600 hover:underline text-sm mt-2">Logout</a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
