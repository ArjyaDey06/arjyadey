import { createClient } from '@/utils/supabase/server';
import Navbar from "@/components/Navbar";
import GithubContributions from "@/components/GithubContributions";
import { getGitHubContributions } from '@/utils/github';
import { ExternalLink, Code, Download, Briefcase, Quote, Wrench, Globe, ArrowDown } from 'lucide-react';
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

export default async function Home() {
  const supabase = await createClient();
  const username = "ArjyaDey06";

  // Fetch all published data + GitHub GraphQL contributions concurrently
  const [
    { data: projects },
    { data: experiences },
    { data: skills },
    { data: testimonials },
    { data: resumes },
    githubData
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
    supabase.from('experiences').select('*').eq('is_published', true).order('start_date', { ascending: false }),
    supabase.from('skills').select('*').order('category', { ascending: true }),
    supabase.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false }),
    supabase.from('resumes').select('*').eq('is_active', true).limit(1),
    getGitHubContributions(username)
  ]);

  const activeResume = resumes?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Floating Responsive Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-8 md:px-12 flex flex-col gap-20 sm:gap-28">
        
        {/* 1. Hero / About Section with GitHub Activity directly beneath */}
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

        {/* 2. Projects Section */}
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

        {/* 3. Experience / Journey Section */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-400" /> Journey & Experience
            </h2>
            <div className="flex flex-col gap-8 sm:gap-10 border-l-2 border-zinc-800 ml-2 sm:ml-3 pl-6 sm:pl-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-2 relative">
                  <span className="absolute -left-[31px] sm:-left-[41px] top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-800 border-4 border-black" />
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 break-words">{exp.role}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400">
                    <span className="text-red-400 font-semibold">{exp.company}</span>
                    <span>•</span>
                    <span>{exp.start_date} — {exp.end_date || 'Present'}</span>
                  </div>
                  {exp.description && (
                    <div className="mt-2 sm:mt-3 prose prose-invert prose-sm max-w-none break-words">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {exp.description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Tech Stack Section */}
        {skills && skills.length > 0 && (
          <section id="stack" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-400" /> Tech Stack
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl flex flex-col hover:border-zinc-600 transition-colors shadow-sm">
                  <span className="font-semibold text-zinc-200 text-sm sm:text-base break-words">{skill.name}</span>
                  <span className="text-[11px] sm:text-xs text-zinc-500">{skill.category}</span>
                </div>
              ))}
            </div>
          </section>
        )}

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
      <footer className="w-full border-t border-zinc-900 py-8 px-6 text-center text-xs sm:text-sm text-zinc-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Arjya Dey. Built with Next.js & Supabase.</p>
          <a href="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Admin Portal →
          </a>
        </div>
      </footer>
    </div>
  );
}
