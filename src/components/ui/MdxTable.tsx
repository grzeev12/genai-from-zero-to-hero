import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid var(--border)", boxShadow: "0 2px 8px rgba(124,92,62,0.05)" }}>
      <table className="w-full text-sm border-collapse" style={{ direction: "rtl" }}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead style={{ background: "var(--cream-dark)" }}>{children}</thead>;
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-3 font-bold text-right"
      style={{ color: "var(--mocha-dark)", borderBottom: "2px solid var(--#c4b09a)" }}>
      {children}
    </th>
  );
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }: { children: ReactNode }) {
  return (
    <tr className="transition-colors hover:bg-[var(--cream)]"
      style={{ borderBottom: "1px solid var(--border)" }}>
      {children}
    </tr>
  );
}

export function Td({ children }: { children: ReactNode }) {
  return (
    <td className="px-5 py-3 text-right align-top"
      style={{ color: "var(--text-secondary)" }}>
      {children}
    </td>
  );
}
