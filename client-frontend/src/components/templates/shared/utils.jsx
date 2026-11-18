export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const m = /^(\d{4})-(\d{2})/.exec(dateStr);
  if (!m) return dateStr;
  return new Date(Number(m[1]), Number(m[2]) - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export const dateRange = (exp) =>
  [formatDate(exp.start_date), exp.is_current ? "Present" : formatDate(exp.end_date)]
    .filter(Boolean)
    .join(" – ");

export const stripProtocol = (url = "") => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const href = (url = "") => (/^https?:\/\//.test(url) ? url : `https://${url}`);

export const bulletLines = (text = "") =>
  text
    .split("\n")
    .map((l) => l.replace(/^\s*[•\-*▪●]\s*/, "").trim())
    .filter(Boolean);

export const Bullets = ({ text, className = "" }) => {
  const lines = bulletLines(text);
  if (!lines.length) return null;
  return (
    <ul className={`list-disc ml-5 space-y-0.5 ${className}`}>
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
};

export const contactItems = (p = {}) =>
  [
    p.email && { label: p.email, href: `mailto:${p.email}` },
    p.phone && { label: p.phone },
    p.location && { label: p.location },
    p.linkedin && { label: stripProtocol(p.linkedin), href: href(p.linkedin) },
    p.github && { label: stripProtocol(p.github), href: href(p.github) },
    p.website && { label: stripProtocol(p.website), href: href(p.website) },
  ].filter(Boolean);

export const Link = ({ item }) =>
  item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer" className="break-all">
      {item.label}
    </a>
  ) : (
    <span className="break-all">{item.label}</span>
  );

export const hasAny = (arr) => Array.isArray(arr) && arr.length > 0;
