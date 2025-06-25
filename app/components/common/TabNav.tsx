import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";

export type Tab = { to: string; label: string };

interface TabNavProps {
  tabs: Tab[];
}

const TabLink = ({ onClick, tab }: { onClick?: React.MouseEventHandler<HTMLAnchorElement>, tab: Tab }) => {
  const location = useLocation();

  return (
    <Link
      key={tab.to}
      to={tab.to}
      className={`tab ${location.pathname.includes(`/${tab.to}`)
        ? "tab-active"
        : "hover:bg-base-100 text-base-content"
        }`}
      onClick={onClick}
    >
      {tab.label}
    </Link>
  )
}


export const TabNav: React.FC<TabNavProps> = ({ tabs }) => {
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
    <div className="tabs tabs-md tabs-border w-full" ref={tabListRef}>
      {tabs.filter((tab) => visibleTabs.includes(tab.to)).map((tab) => (
        <TabLink tab={tab} />
      ))}
      {overflowTabs.length > 0 && (
        <div className="relative">
          <button
            ref={moreBtnRef}
            className="tab"
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
                className="menu menu-lg dropdown-content rounded-box z-1 w-52 p-2 shadow-lg"
                style={{
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  position: "absolute",
                  minWidth: dropdownPos.width,
                }}
              >
                {tabs.filter((tab) => overflowTabs.includes(tab.to)).map((tab) => (
                  <TabLink tab={tab} />
                ))}
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  );
};
