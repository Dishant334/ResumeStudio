import { Bullets, contactItems, dateRange, formatDate, hasAny, href, Link, stripProtocol } from "./shared/utils";

// ATS-friendly, single column, education first – ideal for campus placements
const Section = ({ title, accent, children }) => (
  <section className="mb-4">
    <h2 className="text-[13px] font-bold uppercase tracking-widest pb-0.5 mb-2 border-b-2" style={{ color: accent, borderColor: accent }}>
      {title}
    </h2>
    {children}
  </section>
);

const EngineerTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {};
  const contacts = contactItems(p);
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 px-9 py-8 text-[13px] leading-snug">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{p.full_name || "Your Name"}</h1>
        {p.profession && <p className="text-sm mt-0.5" style={{ color: accentColor }}>{p.profession}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-2 text-xs text-gray-600">
          {contacts.map((c, i) => (
            <span key={i} className="flex gap-3">
              {i > 0 && <span className="text-gray-300">|</span>}
              <Link item={c} />
            </span>
          ))}
        </div>
      </header>

      {data.professional_summary && (
        <Section title="Objective" accent={accentColor}>
          <p>{data.professional_summary}</p>
        </Section>
      )}

      {hasAny(data.education) && (
        <Section title="Education" accent={accentColor}>
          {data.education.map((e, i) => (
            <div key={i} className="flex justify-between mb-1.5 break-inside-avoid">
              <div>
                <p className="font-semibold">{e.institution}</p>
                <p className="text-gray-700">
                  {e.degree}
                  {e.field && `, ${e.field}`}
                  {e.gpa && ` — CGPA/GPA: ${e.gpa}`}
                </p>
              </div>
              <p className="text-gray-600 whitespace-nowrap">{formatDate(e.graduation_date || e.end_date)}</p>
            </div>
          ))}
        </Section>
      )}

      {hasAny(data.skills) && (
        <Section title="Technical Skills" accent={accentColor}>
          <p>{data.skills.join("  •  ")}</p>
        </Section>
      )}

      {hasAny(data.project) && (
        <Section title="Projects" accent={accentColor}>
          {data.project.map((pr, i) => (
            <div key={i} className="mb-2 break-inside-avoid">
              <div className="flex justify-between">
                <p className="font-semibold">
                  {pr.name}
                  {pr.type && <span className="font-normal text-gray-600"> — {pr.type}</span>}
                </p>
                {pr.link && (
                  <a href={href(pr.link)} target="_blank" rel="noreferrer" className="text-xs" style={{ color: accentColor }}>
                    {stripProtocol(pr.link)}
                  </a>
                )}
              </div>
              {pr.tech && <p className="text-xs italic text-gray-600">Tech: {pr.tech}</p>}
              <Bullets text={pr.description} />
            </div>
          ))}
        </Section>
      )}

      {hasAny(data.experience) && (
        <Section title="Experience / Internships" accent={accentColor}>
          {data.experience.map((x, i) => (
            <div key={i} className="mb-2 break-inside-avoid">
              <div className="flex justify-between">
                <p className="font-semibold">
                  {x.position}
                  {x.company && <span className="font-normal"> · {x.company}</span>}
                </p>
                <p className="text-gray-600 whitespace-nowrap">{dateRange(x)}</p>
              </div>
              <Bullets text={x.description} />
            </div>
          ))}
        </Section>
      )}

      {hasAny(data.certifications) && (
        <Section title="Certifications" accent={accentColor}>
          <Bullets text={data.certifications.join("\n")} />
        </Section>
      )}
      {hasAny(data.achievements) && (
        <Section title="Achievements" accent={accentColor}>
          <Bullets text={data.achievements.join("\n")} />
        </Section>
      )}
    </div>
  );
};
export default EngineerTemplate;
