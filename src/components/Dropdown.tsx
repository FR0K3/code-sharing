import { useState, useRef, useEffect } from "react";
import arrowDown from "../assets/icons/down-arrow.svg";

export type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Selecciona",
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);


  function select(option: Option) {
    onChange?.(option.value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block z-50">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full bg-gray-light py-1.5 pl-3 pr-2.5 text-xs font-medium text-gray-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
      >
        <span className={selected ? "" : "text-slate-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <img
          src={arrowDown}
          alt="Arrow Down"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-10 mt-1.5 max-h-60 min-w-full overflow-auto whitespace-nowrap rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(option)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`flex w-full items-center justify-between gap-4 cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-700 ${index === highlighted ? "bg-slate-100" : ""}`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
