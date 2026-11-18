import { Bullets, contactItems, dateRange, formatDate, hasAny, href, Link, stripProtocol } from "./shared/utils";

// Serif, LaTeX-style one-pager – popular for research / MS applications & top tech firms
const H = ({ children }) => (
  <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mt-3.5 mb-1.5 pb-px">{children}</h2>
);

const AcademicTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-black px-10 py-8 text-[13px] leading-snug" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
      <header className="text-center">
        <h1 className="text-[30px] font-bold tracking-wide" style={{ color: accentColor }}>{p.full_name || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-x-2 text-xs mt-1">
          {contactItems(p).map((c, i) => (
            <span key={i} className="flex gap-2">{i > 0 && <span>·</span>}<Link item={c} /></span>
          ))}
        </div>
      </header>

      {data.professional_summary && <><H>Summary</H><p>{data.professional_summary}</p></>}

      {hasAny(data.education) && (
        <>
          <H>Education</H>
          {data.education.map((e, i) => (
            <div key={i} className="flex justify-between mb-1 break-inside-avoid">
              <div>
                <p className="font-bold">{e.institution}</p>
                <p className="italic">{e.degree}{e.field && `, ${e.field}`}{e.gpa && ` (GPA: ${e.gpa})`}</p>
              </div>
              <p>{formatDate(e.graduation_date || e.end_date)}</p>
            </div>
          ))}
        </>
      )}

      {hasAny(data.experience) && (
        <>
          <H>Experience</H>
          {data.experience.map((x, i) => (
            <div key={i} className="mb-2 break-inside-avoid">
              <div className="flex justify-between"><p className="font-bold">{x.position}</p><p>{dateRange(x)}</p></div>
              <p className="italic">{x.company}</p>
              <Bullets text={x.description} />
            </div>
          ))}
        </>
      )}

      {hasAny(data.project) && (
        <>
          <H>Projects & Research</H>
          {data.project.map((pr, i) => (
            <div key={i} className="mb-2 break-inside-avoid">
              <div className="flex justify-between">
                <p><span className="font-bold">{pr.name}</span>{pr.tech && <span> | <span className="italic">{pr.tech}</span></span>}</p>
                {pr.link && <a href={href(pr.link)} target="_blank" rel="noreferrer" className="text-xs underline">{stripProtocol(pr.link)}</a>}
              </div>
              <Bullets text={pr.description} />
            </div>
          ))}
        </>
      )}

      {hasAny(data.skills) && <><H>Technical Skills</H><p>{data.skills.join(", ")}</p></>}
      {hasAny(data.certifications) && <><H>Certifications</H><Bullets text={data.certifications.join("\n")} /></>}
      {hasAny(data.achievements) && <><H>Honors & Achievements</H><Bullets text={data.achievements.join("\n")} /></>}
    </div>
  );
};
export default AcademicTemplate;
