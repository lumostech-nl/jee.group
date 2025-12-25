"use client";

import Link from "next/link";
import React from "react";

type Section = { id: string; title: string };

export default function PrivacyTOC({ sections }: { sections: Section[] }) {
  const handleClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) {
          history.replaceState(null, "", `#${id}`);
        }
      }
    };

  return (
    <nav className="space-y-2">
      {sections.map((s) => (
        <Link
          key={s.id}
          href={`#${s.id}`}
          onClick={handleClick(s.id)}
          className="block text-sm text-[#605A57] hover:text-[#37322F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30 focus-visible:rounded px-1 py-0.5"
        >
          {s.title}
        </Link>
      ))}
    </nav>
  );
}
