"use client";

import Image from "next/image";
import { Bell, ChevronDown, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/hooks/use-rtk";
import type { User } from "@/redux/reducers/user";
import type { IRestaurant } from "@/api/types/restaurant";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { resetUser } from "@/redux/reducers/user";
import { resetRestaurant } from "@/redux/reducers/restaurant";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  showLogo?: boolean;
  subtitle?: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDetails: User = useAppSelector((state) => state.user.userDetails);
  const restaurant: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails,
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogOut = () => {
    dispatch(resetUser());
    dispatch(resetRestaurant());
    Cookies.remove("token");
    router.push("/login");
  };

  const displayName =
    `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`.trim() ||
    userDetails?.email ||
    "Restaurant Partner";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        height: 64,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "0 28px",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--zylo-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Breadcrumb / title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
        >
          Restaurant
        </span>
        <ChevronRight size={14} color="var(--text-disabled)" />
        <h1
          className="font-syne"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginLeft: 6,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            · {subtitle}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          style={{
            position: "relative",
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--surface-1)",
            border: "1px solid var(--zylo-border)",
            color: "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "var(--surface-3)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface-1)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 7,
              height: 7,
              borderRadius: 99,
              background:
                "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
              boxShadow: "var(--shadow-gold)",
            }}
          />
        </button>

        {/* Profile menu */}
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 12px 4px 4px",
              borderRadius: 999,
              background: "var(--surface-1)",
              border: "1px solid var(--zylo-border)",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--surface-3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--surface-1)";
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                overflow: "hidden",
                border: "2px solid var(--gold)",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              <Image
                src={userDetails?.profilePicture?.url || "/defaultImage.jpg"}
                alt="User Avatar"
                width={32}
                height={32}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ textAlign: "left", lineHeight: 1.1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: 1,
                }}
              >
                {restaurant?.restaurantName ?? "—"}
              </div>
            </div>
            <ChevronDown
              size={14}
              color="var(--text-muted)"
              style={{
                transition: "transform 0.2s ease",
                transform: menuOpen ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: 240,
                background: "var(--surface-1)",
                border: "1px solid var(--zylo-border)",
                borderRadius: 14,
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                animation: "fadeUp 0.18s ease both",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--zylo-border)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userDetails?.email ?? ""}
                </div>
              </div>
              <div style={{ padding: 6 }}>
                {[
                  { label: "My Profile", href: "/profile" },
                  { label: "Earnings", href: "/earnings" },
                ].map((it) => (
                  <button
                    key={it.href}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(it.href);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--surface-3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--zylo-border)",
                  padding: 6,
                }}
              >
                <button
                  type="button"
                  onClick={handleLogOut}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--error)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--error-bg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
