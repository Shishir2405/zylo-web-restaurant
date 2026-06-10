"use client";

import { Loader2, Utensils } from "lucide-react";

export default function FullScreenLoader({ text }: { text?: string }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(13, 27, 62, 0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 36px",
          background: "var(--surface-1)",
          borderRadius: 20,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--zylo-border)",
          animation: "fadeUp 0.3s ease both",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, var(--gold-light) 0%, var(--gold-dark) 100%)",
            color: "#fff",
            boxShadow: "var(--shadow-gold)",
            marginBottom: 18,
          }}
          className="animate-glow"
        >
          <Utensils size={26} strokeWidth={2.5} />
        </div>

        <Loader2
          size={28}
          color="var(--gold-dark)"
          className="animate-spin"
        />

        <p
          style={{
            marginTop: 14,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-secondary)",
            letterSpacing: "0.01em",
          }}
        >
          {text || "Fetching your data..."}
        </p>
      </div>
    </div>
  );
}
