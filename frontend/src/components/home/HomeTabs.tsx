"use client";

import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { value: "trending", label: "trending", index: "01" },
  { value: "newest", label: "nuovi", index: "02" },
  { value: "top", label: "top di sempre", index: "03" },
] as const;

export function HomeTabs({ current }: { current: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const setTab = (value: string) => {
    const p = new URLSearchParams(params.toString());
    p.set("sort", value);
    router.push(`/?${p.toString()}`);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {tabs.map((tab, i) => {
          const isActive = current === tab.value;
          return (
            <div key={tab.value} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTab(tab.value)}
                className="home-tab relative font-mono uppercase tracking-[0.2em] flex items-baseline gap-1.5 pb-2"
                style={{
                  fontSize: "11px",
                  color: isActive ? "var(--paper)" : "var(--ghost)",
                  transition: "color 200ms ease",
                }}
                data-active={isActive}
              >
                <span
                  style={{ fontSize: "9px", opacity: 0.75 }}
                  aria-hidden="true"
                >
                  {tab.index}
                </span>
                <span className="home-tab-label">{tab.label}</span>
                {isActive && (
                  <span
                    className="home-tab-underline"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "var(--acid)",
                      transformOrigin: "left",
                      animation: "tab-underline 320ms cubic-bezier(0.77, 0, 0.18, 1) both",
                    }}
                  />
                )}
              </button>
              {i < tabs.length - 1 && (
                <span
                  style={{ color: "var(--ghost)", opacity: 0.35, fontSize: "11px" }}
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes tab-underline {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .home-tab .home-tab-label {
          position: relative;
        }
        .home-tab[data-active="false"] .home-tab-label::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 1px;
          background: var(--ghost);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 200ms ease;
        }
        .home-tab[data-active="false"]:hover {
          color: var(--paper) !important;
        }
        .home-tab[data-active="false"]:hover .home-tab-label::after {
          transform: scaleX(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .home-tab-underline {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
