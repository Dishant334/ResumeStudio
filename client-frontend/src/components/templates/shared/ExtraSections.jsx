import { hasAny } from "./utils";

// Certifications + Achievements block appended under the legacy templates
const ExtraSections = ({ data, accentColor }) => {
  const blocks = [
    ["Certifications", data.certifications],
    ["Achievements", data.achievements],
  ].filter(([, items]) => hasAny(items));
  if (!blocks.length) return null;
  return (
    <div className="max-w-4xl mx-auto bg-white px-8 pb-8 text-gray-800">
      {blocks.map(([title, items]) => (
        <section key={title} className="mb-4 break-inside-avoid">
          <h2 className="text-lg font-semibold mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
            {title}
          </h2>
          <ul className="list-disc ml-5 text-sm space-y-0.5">
            {items.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
export default ExtraSections;
