import { Bullets, contactItems, dateRange, formatDate, hasAny, href, Link, stripProtocol } from "./shared/utils";

// Two-column: coloured sidebar (contact, skills, education, certs) + main column
const Side = ({ title, children }) => (
  <section className="mb-5">
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b border-white/40">{title}</h2>
    {children}
  </section>
);
const Main = ({ title, accent, children }) => (
  <section className="mb-5">
    <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ borderColor: accent, color: accent }}>
      {title}
    </h2>
    {children}
  </section>
);

const SidebarTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 text-[13px] leading-snug flex min-h-[1056px]">
      <aside className="w-[34%] text-white p-6" style={{ backgroundColor: accentColor }}>
        {p.image && (
          <img src={typeof p.image === "string" ? p.image : URL.createObjectURL(p.image)} alt="" className="size-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/40" />
        )}
        <Side title="Contact">
          <ul className="space-y-1.5 text-xs">
            {contactItems(p).map((c, i) => (
              <li key={i}>
                <Link item={c} />
              </li>
            ))}
          </ul>
        </Side>
        {hasAny(data.skills) && (
          <Side title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span key={i} className="text-[11px] bg-white/20 px-2 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </Side>
        )}
        {hasAny(data.education) && (
          <Side title="Education">
            {data.education.map((e, i) => (
              <div key={i} className="mb-3 text-xs break-inside-avoid">
                <p className="font-semibold">{e.institution}</p>
                <p className="opacity-90">
                  {e.degree}
                  {e.field && `, ${e.field}`}
                </p>
                <p className="opacity-80">
                  {formatDate(e.graduation_date || e.end_date)}
                  {e.gpa && ` · ${e.gpa}`}
                </p>
              </div>
            ))}
          </Side>
        )}
        {hasAny(data.certifications) && (
          <Side title="Certifications">
            <ul className="list-disc ml-4 text-xs space-y-1">
              {data.certifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Side>
        )}
      </aside>

      <main className="flex-1 p-7">
        <h1 className="text-3xl font-bold leading-tight">{p.full_name || "Your Name"}</h1>
        {p.profession && <p className="text-base mb-4" style={{ color: accentColor }}>{p.profession}</p>}

        {data.professional_summary && (
          <Main title="Profile" accent={accentColor}>
            <p>{data.professional_summary}</p>
          </Main>
        )}
        {hasAny(data.project) && (
          <Main title="Projects" accent={accentColor}>
            {data.project.map((pr, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between">
                  <p className="font-semibold">{pr.name}{pr.type && <span className="font-normal text-gray-500"> · {pr.type}</span>}</p>
                  {pr.link && <a href={href(pr.link)} target="_blank" rel="noreferrer" className="text-xs" style={{ color: accentColor }}>{stripProtocol(pr.link)}</a>}
                </div>
                {pr.tech && <p className="text-xs text-gray-500 italic">{pr.tech}</p>}
                <Bullets text={pr.description} />
              </div>
            ))}
          </Main>
        )}
        {hasAny(data.experience) && (
          <Main title="Experience" accent={accentColor}>
            {data.experience.map((x, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between">
                  <p className="font-semibold">{x.position}</p>
                  <p className="text-xs text-gray-500">{dateRange(x)}</p>
                </div>
                <p className="text-gray-600 text-xs mb-1">{x.company}</p>
                <Bullets text={x.description} />
              </div>
            ))}
          </Main>
        )}
        {hasAny(data.achievements) && (
          <Main title="Achievements" accent={accentColor}>
            <Bullets text={data.achievements.join("\n")} />
          </Main>
        )}
      </main>
    </div>
  );
};
export default SidebarTemplate;
