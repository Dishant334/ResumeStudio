import { Bullets, contactItems, dateRange, formatDate, hasAny, href, Link, stripProtocol } from "./shared/utils";

// Fresher / campus-placement: education & skills up front, projects as the hero
const Head = ({ children, accent }) => (
  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-2 mt-4">
    <span className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: accent }} />
    {children}
  </h2>
);

const CampusTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 px-9 py-8 text-[13px] leading-snug">
      <header className="flex items-center justify-between gap-6 pb-4 border-b" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: accentColor }}>{p.full_name || "Your Name"}</h1>
          {p.profession && <p className="text-sm text-gray-600 mt-0.5">{p.profession}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs text-gray-600">
            {contactItems(p).map((c, i) => <Link key={i} item={c} />)}
          </div>
        </div>
        {p.image && <img src={typeof p.image === "string" ? p.image : URL.createObjectURL(p.image)} alt="" className="size-20 rounded-lg object-cover" />}
      </header>

      {data.professional_summary && <><Head accent={accentColor}>Career Objective</Head><p>{data.professional_summary}</p></>}

      {hasAny(data.education) && (
        <>
          <Head accent={accentColor}>Education</Head>
          <div className="grid gap-1.5">
            {data.education.map((e, i) => (
              <div key={i} className="flex justify-between rounded-md bg-gray-50 px-3 py-2 break-inside-avoid">
                <div>
                  <p className="font-semibold">{e.degree}{e.field && ` — ${e.field}`}</p>
                  <p className="text-gray-600">{e.institution}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>{formatDate(e.graduation_date || e.end_date)}</p>
                  {e.gpa && <p className="font-semibold" style={{ color: accentColor }}>{e.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {hasAny(data.skills) && (
        <>
          <Head accent={accentColor}>Skills</Head>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full text-xs border" style={{ borderColor: accentColor, color: accentColor }}>{s}</span>
            ))}
          </div>
        </>
      )}

      {hasAny(data.project) && (
        <>
          <Head accent={accentColor}>Academic & Personal Projects</Head>
          {data.project.map((pr, i) => (
            <div key={i} className="mb-2.5 break-inside-avoid">
              <div className="flex justify-between">
                <p className="font-semibold">{pr.name}{pr.type && <span className="font-normal text-gray-500"> ({pr.type})</span>}</p>
                {pr.link && <a href={href(pr.link)} target="_blank" rel="noreferrer" className="text-xs" style={{ color: accentColor }}>{stripProtocol(pr.link)}</a>}
              </div>
              {pr.tech && <p className="text-xs"><span className="font-semibold">Tech:</span> {pr.tech}</p>}
              <Bullets text={pr.description} />
            </div>
          ))}
        </>
      )}

      {hasAny(data.experience) && (
        <>
          <Head accent={accentColor}>Internships & Experience</Head>
          {data.experience.map((x, i) => (
            <div key={i} className="mb-2.5 break-inside-avoid">
              <div className="flex justify-between">
                <p className="font-semibold">{x.position}, <span className="font-normal">{x.company}</span></p>
                <p className="text-gray-500 text-xs">{dateRange(x)}</p>
              </div>
              <Bullets text={x.description} />
            </div>
          ))}
        </>
      )}

      {(hasAny(data.certifications) || hasAny(data.achievements)) && (
        <div className="grid grid-cols-2 gap-6">
          {hasAny(data.certifications) && <div><Head accent={accentColor}>Certifications</Head><Bullets text={data.certifications.join("\n")} /></div>}
          {hasAny(data.achievements) && <div><Head accent={accentColor}>Achievements</Head><Bullets text={data.achievements.join("\n")} /></div>}
        </div>
      )}
    </div>
  );
};
export default CampusTemplate;
