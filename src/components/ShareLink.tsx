import { useState } from "react";
import linkIcon from "../assets/icons/link.svg";

type Props = {
  url: string
  theme: string
};

export default function ShareLink({ url, theme }: Props) {
  const [copied, setCopied] = useState(false);

  const label = (() => {
    return `.../${url}`;
  })();

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // navigator.clipboard requiere HTTPS o localhost
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={url}
      aria-label={`Copy url ${url} `}
      className={`flex items-center gap-2 max-w-55 rounded-lg px-3 py-2 cursor-pointer ${theme === "vs-dark" ? "text-dark-btn" : "text-gray-dark"} `}
    >
      <img src={linkIcon} alt="linkIcon" />
      <span className="min-w-0 truncate">{copied ? "Copied!" : label}</span>
    </button>
  );
}