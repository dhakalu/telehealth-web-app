import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { createPortal } from "react-dom";

export type Tab = { to: string; label: string };

interface TabNavProps {
  tabs: Tab[];
}

export const TabNav: React.FC<TabNavProps> = ({ tabs }) => {
  const location = useLocation();
  const tabListRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>();
  const [visibleTabs, setVisibleTabs] = useState<string[]>([]);
  const [overflowTabs, setOverflowTabs] = useState<string[]>([]);

  useEffect(() => {
    // Responsive tab overflow logic
    const handleResize = () => {
      const container = tabListRef.current;
      if (!container) return;
      const containerWidth = container.offsetWidth;
      let total = 0;
      const vis: string[] = [];
      const over: string[] = [];
      for (let i = 0; i < tabs.length; i++) {
        // Estimate width per tab (could be improved with refs per tab)
        total += 120;
        if (total < containerWidth - 60) {
          vis.push(tabs[i].to);
        } else {
          over.push(tabs[i].to);
        }
      }
      setVisibleTabs(vis);
      setOverflowTabs(over);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tabs]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreBtnRef.current &&
        !moreBtnRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Calculate dropdown position for portal
  useEffect(() => {
    if (showDropdown && moreBtnRef.current) {
      const rect = moreBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192 + window.scrollX, // 192px = w-48
        width: rect.width,
      });
    }
  }, [showDropdown]);

  // Reposition on window resize
  useEffect(() => {
    if (!showDropdown) return;
    const handle = () => {
      if (moreBtnRef.current) {
        const rect = moreBtnRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.right - 192 + window.scrollX,
          width: rect.width,
        });
      }
    };
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [showDropdown]);

  return (
    <div className="flex flex-row flex-nowrap w-full" ref={tabListRef}>
      {tabs.filter((tab) => visibleTabs.includes(tab.to)).map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`px-6 py-3 -mb-px border-b-2 font-medium text-sm transition-colors duration-200 ${
            location.pathname.includes(`/${tab.to}`)
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
          }`}
        >
          {tab.label}
        </Link>
      ))}
      {overflowTabs.length > 0 && (
        <div className="relative">
          <button
            ref={moreBtnRef}
            className="px-4 py-3 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 flex items-center"
            onClick={() => setShowDropdown((v) => !v)}
            aria-haspopup="true"
            aria-expanded={showDropdown}
            type="button"
          >
            More {showDropdown ? "" : <span className="sr-only">Open dropdown</span>}
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showDropdown && dropdownPos &&
            createPortal(
              <div
                ref={dropdownRef}
                className="absolute w-48 bg-white border rounded shadow-lg z-50"
                style={{
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  position: "absolute",
                  minWidth: dropdownPos.width,
                }}
              >
                {tabs.filter((tab) => overflowTabs.includes(tab.to)).map((tab) => (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className={`block px-4 py-2 text-sm ${
                      location.pathname.includes(`/${tab.to}`)
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setShowDropdown(false)}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  );
};
