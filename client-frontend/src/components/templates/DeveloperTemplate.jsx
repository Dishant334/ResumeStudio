import { Bullets, contactItems, dateRange, formatDate, hasAny, href, Link, stripProtocol } from "./shared/utils";

// Terminal / code-editor inspired – for software, ML & web developers
const H = ({ children, accent }) => (
  <h2 className="font-mono text-sm font-bold mb-2 mt-5" style={{ color: accent }}>
    <span className="opacity-60">## </span>
    {children}
  </h2>
);

const DeveloperTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-slate-800 text-[13px] leading-snug">
      <header className="px-9 py-7 bg-slate-900 text-slate-100">
        <p className="font-mono text-xs" style={{ color: accentColor }}>
          &gt; whoami
        </p>
        <h1 className="text-3xl font-bold mt-1">{p.full_name || "Your Name"}</h1>
        {p.profession && <p className="font-mono text-sm text-slate-300 mt-0.5">{p.profession}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 font-mono text-[11px] text-slate-300">
          {contactItems(p).map((c, i) => (
            <Link key={i} item={c} />
          ))}
        </div>
      </header>

      <div className="px-9 pb-8">
        {data.professional_summary && (
          <>
            <H accent={accentColor}>about</H>
            <p>{data.professional_summary}</p>
          </>
        )}

        {hasAny(data.skills) && (
          <>
            <H accent={accentColor}>tech_stack</H>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span key={i} className="font-mono text-[11px] px-2 py-0.5 rounded border" style={{ borderColor: accentColor, color: accentColor }}>
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        {hasAny(data.project) && (
          <>
            <H accent={accentColor}>projects</H>
            {data.project.map((pr, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold">
                    {pr.name}
                    {pr.type && <span className="font-mono text-[11px] text-slate-500"> [{pr.type}]</span>}
                  </p>
                  {pr.link && (
                    <a href={href(pr.link)} target="_blank" rel="noreferrer" className="font-mono text-[11px]" style={{ color: accentColor }}>
                      {stripProtocol(pr.link)}
                    </a>
                  )}
                </div>
                {pr.tech && <p className="font-mono text-[11px] text-slate-500">{pr.tech}</p>}
                <Bullets text={pr.description} className="mt-0.5" />
              </div>
            ))}
          </>
        )}

        {hasAny(data.experience) && (
          <>
            <H accent={accentColor}>experience</H>
            {data.experience.map((x, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className="flex justify-between">
                  <p className="font-semibold">
                    {x.position} <span className="font-normal text-slate-500">@ {x.company}</span>
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">{dateRange(x)}</p>
                </div>
                <Bullets text={x.description} />
              </div>
            ))}
          </>
        )}

        {hasAny(data.education) && (
          <>
            <H accent={accentColor}>education</H>
            {data.education.map((e, i) => (
              <div key={i} className="flex justify-between mb-1.5 break-inside-avoid">
                <div>
                  <p className="font-semibold">{e.institution}</p>
                  <p className="text-slate-600">
                    {e.degree}
                    {e.field && `, ${e.field}`}
                    {e.gpa && ` · ${e.gpa}`}
                  </p>
                </div>
                <p className="font-mono text-[11px] text-slate-500">{formatDate(e.graduation_date || e.end_date)}</p>
              </div>
            ))}
          </>
        )}

        {hasAny(data.certifications) && (
          <>
            <H accent={accentColor}>certifications</H>
            <Bullets text={data.certifications.join("\n")} />
          </>
        )}
        {hasAny(data.achievements) && (
          <>
            <H accent={accentColor}>achievements</H>
            <Bullets text={data.achievements.join("\n")} />
          </>
        )}
      </div>
    </div>
  );
};
export default DeveloperTemplate;
