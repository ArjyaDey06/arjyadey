'use client';

import { useState, useMemo } from 'react';
import { getTechIcon } from '@/utils/techIcons';
import { 
  Wrench, 
  Layers, 
  Code2, 
  Layout, 
  Server, 
  Database, 
  Brain, 
  Cloud, 
  Zap, 
  BarChart3, 
  Tag 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name?: string | null;
}

interface Props {
  skills: Skill[];
}

const DEFAULT_CATEGORY_ORDER = [
  'All',
  'Languages',
  'Frontend',
  'Backend & API',
  'Databases & Storage',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Workflow & Automation',
  'Data Analytics & BI',
];

function getCategoryIcon(category: string) {
  const norm = category.toLowerCase().trim();
  if (norm === 'all') return Layers;
  if (norm.includes('language') || norm.includes('code')) return Code2;
  if (norm.includes('front') || norm.includes('ui')) return Layout;
  if (norm.includes('back') || norm.includes('api')) return Server;
  if (norm.includes('database') || norm.includes('storage') || norm.includes('data')) {
    if (norm.includes('analytic') || norm.includes('bi')) return BarChart3;
    return Database;
  }
  if (norm.includes('ai') || norm.includes('machine') || norm.includes('learning')) return Brain;
  if (norm.includes('cloud') || norm.includes('devops')) return Cloud;
  if (norm.includes('work') || norm.includes('auto')) return Zap;
  if (norm.includes('analytic') || norm.includes('bi')) return BarChart3;
  return Tag;
}

function TechCard({ tech }: { tech: Skill }) {
  const iconUrl = getTechIcon(tech.name, tech.icon_name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="group p-3.5 sm:p-4 bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-600 rounded-2xl flex items-center gap-3.5 hover:bg-zinc-900/60 transition-colors shadow-sm hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5"
    >
      {/* Tech Vector Logo */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/60 group-hover:border-zinc-700 transition-colors">
        <img
          src={iconUrl}
          alt={tech.name}
          loading="lazy"
          className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Tool Name & Category */}
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-zinc-100 text-sm sm:text-base leading-tight truncate group-hover:text-white transition-colors">
          {tech.name}
        </span>
        <span className="text-[11px] text-zinc-500 truncate mt-0.5 group-hover:text-zinc-400 transition-colors">
          {tech.category}
        </span>
      </div>
    </motion.div>
  );
}

export default function TechStack({ skills = [] }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Extract all unique categories dynamically
  const categories = useMemo(() => {
    const rawCategories = Array.from(
      new Set(skills.map((s) => s.category).filter(Boolean))
    );

    // Sort according to DEFAULT_CATEGORY_ORDER, placing any new custom categories at the end
    const sorted = DEFAULT_CATEGORY_ORDER.filter(
      (cat) => cat === 'All' || rawCategories.includes(cat)
    );

    rawCategories.forEach((cat) => {
      if (!sorted.includes(cat)) {
        sorted.push(cat);
      }
    });

    return sorted;
  }, [skills]);

  // Filter skills based on selected category
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <section id="stack" className="scroll-mt-28 sm:scroll-mt-32 flex flex-col gap-6 sm:gap-8">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
          <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" /> Tech Stack
        </h2>
        <p className="text-sm text-zinc-400">
          Languages, frameworks, databases, and tools I use to build scalable software
        </p>
      </div>

      {/* Category Filter Navigation Bar */}
      <div className="w-full flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const CategoryIcon = getCategoryIcon(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-md shadow-white/10 scale-[1.02]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <CategoryIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
              <span>{category}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Cards - The Magic is Here */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-sm">
          No skills found in this category.
        </div>
      )}
    </section>
  );
}
