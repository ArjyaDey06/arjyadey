import { createClient } from '@/utils/supabase/server';
import Navbar from "@/components/Navbar";
import GithubContributions from "@/components/GithubContributions";
import TechStack from "@/components/TechStack";
import { getGitHubContributions } from '@/utils/github';
import { ExternalLink, Code, Download, Briefcase, Quote, Wrench, Globe, ArrowDown, GraduationCap, BookOpen, School, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function getDomainName(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('github')) return 'GitHub';
    return host;
  } catch {
    return 'Link';
  }
}

function formatPeriod(startDate: string, endDate?: string | null) {
  try {
    const [sYear, sMonth] = startDate.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!endDate) return `${start} — Present`;
    const [eYear, eMonth] = endDate.split('-').map(Number);
    const end = new Date(eYear, eMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${start} — ${end}`;
  } catch {
    return `${startDate} — ${endDate || 'Present'}`;
  }
}

function getEducationIcon(stage: string) {
  const s = (stage || '').toLowerCase();
  if (s.includes('graduat') || s.includes('college') || s.includes('degree') || s.includes('master') || s.includes('b.e')) {
    return GraduationCap;
  }
  if (s.includes('high') || s.includes('secondary') || s.includes('diploma')) {
    return BookOpen;
  }
  return School;
}

const defaultEducationJourney = [
  {
    stage: 'Graduation',
    degree: 'B.E in Computer Science Engineering (Data Science)',
    institution: 'A.P. Shah Institute Of Technology, Thane',
    board: 'University of Mumbai',
    period: '2023 — 2027',
    is_current: true,
  },
  {
    stage: 'High Schooling',
    degree: 'Higher Secondary Education (Class XI — XII)',
    institution: 'Euro School, Thane',
    board: 'Council for the Indian School Certificate Examinations',
    period: '2021 — 2023',
    is_current: false,
  },
  {
    stage: 'Junior Schooling',
    degree: 'Primary & Secondary Schooling (Class I — X)',
    institution: 'Lok Puram Public School, Thane',
    board: 'Central Board of Secondary Education',
    period: '2009 — 2021',
    is_current: false,
  },
];

export default async function Home() {
  const supabase = await createClient();
  const username = "ArjyaDey06";

  // Fetch all published data + GitHub GraphQL contributions concurrently
  const [
    { data: projects },
    { data: experiences },
    { data: educationData },
    { data: skills },
    { data: testimonials },
    { data: resumes },
    githubData
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
    supabase.from('experiences').select('*').eq('is_published', true).order('start_date', { ascending: false }),
    supabase.from('education').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').order('category', { ascending: true }),
    supabase.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false }),
    supabase.from('resumes').select('*').eq('is_active', true).limit(1),
    getGitHubContributions(username)
  ]);

  const activeResume = resumes?.[0];
  const educationList = (educationData && educationData.length > 0) ? educationData : defaultEducationJourney;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Floating Responsive Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-8 md:px-12 flex flex-col gap-20 sm:gap-28">
        
        {/* 1. Hero / About Section with GitHub Activity */}
        <section id="about" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8 pt-4 sm:pt-6">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs font-medium text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for new opportunities
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent break-words">
              Hi, I'm Arjya.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              A software developer focused on crafting clean, performant, and intuitive web applications with modern architecture.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2">
              {activeResume && (
                <a 
                  href={activeResume.file_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm sm:text-base font-semibold rounded-full hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}
              <a 
                href="#projects" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-zinc-200 text-sm sm:text-base font-medium rounded-full border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
              >
                Explore Work <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* GitHub Activity card placed directly beneath the Hero */}
          <div className="pt-2 sm:pt-4">
            <GithubContributions username={username} initialData={githubData} />
          </div>
        </section>

        {/* 2. Tech Stack Section (Synchronized right after About) */}
        {skills && skills.length > 0 && (
          <TechStack skills={skills} />
        )}

        {/* 3. Projects Section */}
        <section id="projects" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Selected Work</h2>
            <span className="text-xs font-mono text-zinc-500">
              {projects?.length || 0} {projects?.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="group flex flex-col justify-between p-5 sm:p-8 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl sm:rounded-3xl hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors break-words">
                      {project.title}
                    </h3>
                    
                    {project.description && (
                      <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-red-400 prose-headings:font-bold prose-headings:mt-6 sm:prose-headings:mt-8 prose-headings:mb-3 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400 break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {project.description}
                        </ReactMarkdown>
                      </div>
                    )}

                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                        {project.tech_stack.map((tech: string) => (
                          <span key={tech} className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium bg-zinc-900 text-zinc-300 rounded-full border border-zinc-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-zinc-800/60">
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                        <Code className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {project.live_link && (
                      <a href={project.live_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" /> Live Site
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">More projects coming soon...</p>
            )}
          </div>
        </section>

        {/* 4. Journey & Experience Section */}
        <section id="experience" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-emerald-400" /> Journey & Experience
            </h2>
            <p className="text-sm text-zinc-400">Professional experience and educational milestones</p>
          </div>

          <div className="relative border-l-2 border-zinc-800/90 ml-3 sm:ml-4 pl-6 sm:pl-9 flex flex-col gap-10">
            {/* 1. Dynamic Work Experiences from Admin Panel (Top) */}
            {experiences && experiences.length > 0 && experiences.map((exp) => {
              const isPresent = !exp.end_date || exp.end_date === 'Present';
              return (
                <div key={exp.id} className="relative flex flex-col gap-3 group">
                  {/* Timeline Indicator Dot */}
                  <div className={`absolute -left-[33px] sm:-left-[45px] top-1.5 w-4 h-4 rounded-full border-4 border-black transition-colors duration-300 ${
                    isPresent 
                      ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] ring-2 ring-emerald-500/20' 
                      : 'bg-zinc-700 group-hover:bg-zinc-500'
                  }`} />
                  
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                        Experience
                      </span>
                      {isPresent && (
                        <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800/80">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {formatPeriod(exp.start_date, exp.end_date)}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-md">
                    <div className="flex items-start gap-4">
                      {exp.company_logo_url ? (
                        <div className="shrink-0 flex items-center justify-center">
                          <img
                            src={exp.company_logo_url}
                            alt={exp.company}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight leading-snug">
                          {exp.role}
                        </h3>
                        <p className="mt-0.5 text-sm sm:text-base font-semibold text-red-400">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    {exp.description && (
                      <div className="mt-3.5 pt-3 border-t border-zinc-800/60 prose prose-invert prose-sm max-w-none text-zinc-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {exp.description}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 2. Educational Milestones (Dynamic from Database) */}
            {educationList.map((item: any, idx: number) => {
              const Icon = getEducationIcon(item.stage);
              const isCurrent = item.is_current;

              return (
                <div key={item.id || idx} className="relative flex flex-col gap-3 group">
                  {/* Timeline Indicator Dot */}
                  <div className={`absolute -left-[33px] sm:-left-[45px] top-1.5 w-4 h-4 rounded-full border-4 border-black transition-colors duration-300 ${
                    isCurrent && (!experiences || experiences.length === 0)
                      ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] ring-2 ring-emerald-500/20' 
                      : 'bg-zinc-700 group-hover:bg-zinc-500'
                  }`} />

                  {/* Card Header & Stage Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isCurrent 
                          ? 'bg-zinc-900 text-zinc-200 border border-zinc-700' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        {item.stage}
                      </span>
                      {isCurrent && (
                        <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Current
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800/80">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {item.period}
                    </span>
                  </div>

                  {/* Degree & Institution */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-md">
                    <div className="flex items-start gap-4">
                      {item.institution_logo_url ? (
                        <div className="shrink-0 flex items-center justify-center">
                          <img
                            src={item.institution_logo_url}
                            alt={item.institution}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight leading-snug">
                          {item.degree}
                        </h3>

                        <p className="mt-0.5 text-sm sm:text-base font-medium text-zinc-300">
                          {item.institution}
                        </p>

                        {item.board && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {item.board_logo_url && (
                              <img
                                src={item.board_logo_url}
                                alt={item.board}
                                className="w-4 h-4 rounded-full object-contain bg-zinc-800 border border-zinc-700/60 p-0.5 shrink-0"
                              />
                            )}
                            <span className="text-xs text-zinc-400 font-mono">
                              {item.board}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <div className="mt-3.5 pt-3 border-t border-zinc-800/60 prose prose-invert prose-sm max-w-none text-zinc-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.description}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
          <section id="testimonials" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-400" /> Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="p-5 sm:p-8 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl sm:rounded-3xl flex flex-col gap-4 sm:gap-6 hover:bg-zinc-900/60 transition-colors shadow-lg">
                  <p className="text-zinc-300 italic text-sm sm:text-base leading-relaxed break-words">"{test.content}"</p>
                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <div>
                      <p className="font-bold text-white text-base sm:text-lg break-words">{test.author_name}</p>
                      {test.author_role && <p className="text-sm text-red-400 font-medium">{test.author_role}</p>}
                    </div>
                    {test.social_links && test.social_links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-zinc-800/60">
                        {test.social_links.map((link: string, idx: number) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600 transition-colors"
                          >
                            <Globe className="w-3 h-3" />
                            {getDomainName(link)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Responsive Footer */}
      <footer className="w-full border-t border-zinc-900 py-8 px-6 text-center text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <p className="text-white font-medium tracking-wide">
            © {new Date().getFullYear()} Arjya Dey | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
