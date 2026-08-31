"use client";

import { getPasswordChecklist, PASSWORD_EXAMPLE } from "@/lib/passwordValidation";

const ITEMS: { key: keyof ReturnType<typeof getPasswordChecklist>; label: string }[] = [
  { key: "length", label: "At least 8 characters" },
  { key: "uppercase", label: "One uppercase letter (A-Z)" },
  { key: "lowercase", label: "One lowercase letter (a-z)" },
  { key: "number", label: "One number (0-9)" },
  { key: "special", label: "One special character (e.g. @ # $ %)" },
];

export function PasswordRequirements({ password }: { password: string }) {
  const checklist = getPasswordChecklist(password);

  return (
    <div className="mt-2">
      <ul className="text-xs space-y-1">
        {ITEMS.map(({ key, label }) => (
          <li
            key={key}
            className={`flex items-center gap-1.5 ${
              checklist[key] ? "text-chalkboard" : "text-ink-soft/60"
            }`}
          >
            <span aria-hidden>{checklist[key] ? "✓" : "○"}</span>
            {label}
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-soft/70 mt-1.5">
        Example of a strong password: <span className="font-ledger">{PASSWORD_EXAMPLE}</span>
      </p>
    </div>
  );
}
