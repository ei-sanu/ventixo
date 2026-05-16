import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const COUNTRIES: Country[] = [
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81" },
  { name: "UAE", code: "AE", flag: "🇦🇪", dialCode: "+971" },
  { name: "Singapore", code: "SG", flag: "SG", dialCode: "+65" },
];

interface Props {
  value: string; // The dial code
  onChange: (dialCode: string) => void;
}

export function CountryCodeSelector({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountry = COUNTRIES.find(c => c.dialCode === value) || COUNTRIES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3 rounded-xl glass border-border hover:bg-foreground/5 transition text-sm h-full min-w-[90px] justify-between"
      >
        <span className="flex items-center gap-2">
          <span>{selectedCountry.flag}</span>
          <span className="font-medium">{selectedCountry.dialCode}</span>
        </span>
        <FiChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto rounded-2xl glass border-border shadow-2xl z-[120] p-1 custom-scrollbar">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.dialCode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition text-left ${
                  value === country.dialCode ? "bg-foreground/10 font-bold" : "hover:bg-foreground/5"
                }`}
              >
                <span>{country.flag}</span>
                <span className="flex-1">{country.name}</span>
                <span className="text-[10px] text-muted-foreground">{country.dialCode}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
