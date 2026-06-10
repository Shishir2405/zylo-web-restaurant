"use client";

import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Wallet,
  User,
  LogOut,
  ChevronRight,
  Tag,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { resetUser } from "@/redux/reducers/user";
import { resetRestaurant } from "@/redux/reducers/restaurant";

type Active =
  | "dashboard"
  | "products"
  | "orders"
  | "earnings"
  | "profile"
  | "logout"
  | "categories";

type Item = {
  key: Active;
  label: string;
  href: string;
  icon: any;
  children?: { key: Active; label: string; href: string }[];
};

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        key: "categories",
        label: "Categories",
        href: "/categories",
        icon: Tag,
        children: [
          { key: "products", label: "Products", href: "/categories/products" },
        ],
      },
    ],
  },
  {
    title: "Orders & Earnings",
    items: [
      { key: "orders", label: "Orders", href: "/orders", icon: ShoppingBag },
      { key: "earnings", label: "Earnings", href: "/earnings", icon: Wallet },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", label: "My Profile", href: "/profile", icon: User },
    ],
  },
];

export default function Sidebar({ active }: { active: Active }) {
  const dispatch = useDispatch();
  const [openCategories, setOpenCategories] = useState(
    active === "categories" || active === "products",
  );

  const handleLogOut = () => {
    dispatch(resetUser());
    dispatch(resetRestaurant());
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <aside
      style={{
        position: "sticky",
        top: 0,
        display: "flex",
        height: "100vh",
        width: 260,
        flexDirection: "column",
        background: "var(--surface-1)",
        borderRight: "1px solid var(--zylo-border)",
        boxShadow: "var(--shadow-sm)",
        flexShrink: 0,
      }}
    >
      {/* Logo block */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "20px 22px",
          borderBottom: "1px solid var(--zylo-border)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, var(--gold-light) 0%, var(--gold-dark) 100%)",
            color: "#fff",
            boxShadow: "var(--shadow-gold)",
          }}
        >
          <Utensils size={18} strokeWidth={2.5} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.1,
          }}
        >
          <span
            className="font-syne"
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Zyl<span className="text-gold-gradient">o</span>
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            Restaurant
          </span>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
        {GROUPS.map((group, gi) => (
          <div
            key={group.title}
            style={{
              marginBottom: 16,
              animation: `fadeUp 0.4s ease both`,
              animationDelay: `${gi * 60}ms`,
            }}
          >
            <div
              style={{
                padding: "0 12px",
                marginBottom: 6,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-disabled)",
              }}
            >
              {group.title}
            </div>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  active === item.key ||
                  (item.key === "categories" && active === "products");
                const hasChildren = !!item.children?.length;
                const isOpen = hasChildren && (openCategories || isActive);

                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() =>
                        hasChildren && setOpenCategories((o) => !o)
                      }
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive
                          ? "var(--gold-dark)"
                          : "var(--text-muted)",
                        background: isActive ? "var(--gold-bg)" : "transparent",
                        border: `1px solid ${isActive ? "var(--gold-border)" : "transparent"}`,
                        textDecoration: "none",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background =
                            "var(--surface-3)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-muted)";
                        }
                      }}
                    >
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            left: -12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: 22,
                            width: 4,
                            borderRadius: "0 99px 99px 0",
                            background:
                              "linear-gradient(180deg, var(--gold-light), var(--gold-dark))",
                          }}
                        />
                      )}
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.4 : 2}
                        color={isActive ? "var(--gold-dark)" : "currentColor"}
                      />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {hasChildren && (
                        <ChevronRight
                          size={14}
                          style={{
                            transition: "transform 0.2s ease",
                            transform: isOpen
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            color: "var(--text-muted)",
                          }}
                        />
                      )}
                    </Link>

                    {hasChildren && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                          overflow: "hidden",
                          transition: "grid-template-rows 0.3s ease",
                        }}
                      >
                        <div style={{ minHeight: 0 }}>
                          <ul
                            style={{
                              margin: "4px 0 0 32px",
                              padding: "2px 0 2px 12px",
                              borderLeft: "1px solid var(--zylo-border)",
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              listStyle: "none",
                            }}
                          >
                            {item.children!.map((c) => {
                              const childActive = active === c.key;
                              return (
                                <li key={c.key}>
                                  <Link
                                    href={c.href}
                                    style={{
                                      display: "block",
                                      padding: "6px 12px",
                                      borderRadius: 8,
                                      fontSize: 12.5,
                                      fontWeight: childActive ? 700 : 500,
                                      color: childActive
                                        ? "var(--gold-dark)"
                                        : "var(--text-muted)",
                                      background: childActive
                                        ? "var(--gold-bg)"
                                        : "transparent",
                                      textDecoration: "none",
                                      transition: "var(--transition)",
                                    }}
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / logout */}
      <div style={{ padding: 12, borderTop: "1px solid var(--zylo-border)" }}>
        <button
          type="button"
          onClick={handleLogOut}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid transparent",
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "var(--error-bg)";
            (e.currentTarget as HTMLElement).style.color = "var(--error)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--error-border)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          }}
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
