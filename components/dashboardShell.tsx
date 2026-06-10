"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

type Active =
  | "dashboard"
  | "products"
  | "orders"
  | "earnings"
  | "profile"
  | "logout"
  | "categories";

/**
 * Single layout shell every authenticated page should use.
 *
 *   ┌───────────┬───────────────────────────┐
 *   │           │  Header (sticky)          │
 *   │  Sidebar  ├───────────────────────────┤
 *   │  (fixed)  │                           │
 *   │           │  scrollable main content  │
 *   │           │                           │
 *   └───────────┴───────────────────────────┘
 *
 * Only the <main> region scrolls — the page body itself does not, so the
 * sidebar and header stay anchored. This replaces the previous flow where
 * pages were full-page-scroll and the sidebar disappeared past the fold.
 */
export default function DashboardShell({
  active,
  title,
  subtitle,
  children,
}: {
  active: Active;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-page)",
      }}
    >
      <Sidebar active={active} />
      <div
        style={{
          display: "flex",
          flex: 1,
          minWidth: 0,
          flexDirection: "column",
        }}
      >
        <Header title={title} subtitle={subtitle} />
        <main
          key={active + "-" + title}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div style={{ margin: "0 auto", maxWidth: 1280 }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
