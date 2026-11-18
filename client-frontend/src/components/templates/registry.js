import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import MinimalImageTemplate from "./MinimalImageTemplate";
import EngineerTemplate from "./EngineerTemplate";
import DeveloperTemplate from "./DeveloperTemplate";
import SidebarTemplate from "./SidebarTemplate";
import CampusTemplate from "./CampusTemplate";
import AcademicTemplate from "./AcademicTemplate";

// legacy: template doesn't render certifications / achievements / project tech itself
export const templates = [
  { id: "engineer", name: "Engineer ATS", tag: "Engineering", desc: "Single-column, ATS-safe, education first. Best for campus placements.", Component: EngineerTemplate },
  { id: "developer", name: "Dev Terminal", tag: "Engineering", desc: "Code-editor inspired. Great for software, web & ML roles.", Component: DeveloperTemplate },
  { id: "sidebar", name: "Tech Sidebar", tag: "Engineering", desc: "Two-column with skills & certifications in a sidebar.", Component: SidebarTemplate },
  { id: "campus", name: "Campus Fresher", tag: "Engineering", desc: "Projects, internships and CGPA front and centre for freshers.", Component: CampusTemplate },
  { id: "academic", name: "Academic Serif", tag: "Engineering", desc: "LaTeX-style serif one-pager for research, MS & top tech firms.", Component: AcademicTemplate },
  { id: "classic", name: "Classic", tag: "General", desc: "Traditional format with clear sections.", Component: ClassicTemplate, legacy: true },
  { id: "modern", name: "Modern", tag: "General", desc: "Colour header band and modern type.", Component: ModernTemplate, legacy: true },
  { id: "minimal", name: "Minimal", tag: "General", desc: "Ultra-clean, content first.", Component: MinimalTemplate, legacy: true },
  { id: "minimalImage", name: "Minimal Image", tag: "General", desc: "Minimal layout with a profile photo.", Component: MinimalImageTemplate, legacy: true },
];

export const getTemplate = (id) => templates.find((t) => t.id === id) || templates[0];
