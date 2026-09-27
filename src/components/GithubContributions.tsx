'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ActivityCalendar } from 'react-activity-calendar';
import { GitHubCalendar } from 'react-github-calendar';
import type { ActivityDay } from '@/utils/github';
import { GitCommit, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  username: string;
  initialData?: {
    totalContributions: number;
    days: ActivityDay[];
  } | null;
}

function formatDateTooltip(count: number, dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = date.getDate();
  const yearNum = date.getFullYear();

  const countStr = count === 0 ? 'No contributions' : `${count} contribution${count === 1 ? '' : 's'}`;
  return `${countStr} on ${monthName} ${dayNum < 10 ? '0' + dayNum : dayNum}, ${yearNum}`;
}

export default function GithubContributions({ username, initialData }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<{ text: string; x: number; y: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && scrollContainerRef.current) {
      // Scroll to the latest contributions (rightmost edge) by default
      const el = scrollContainerRef.current;
      el.scrollLeft = el.scrollWidth;
      checkScroll();
    }
  }, [mounted, initialData]);

  const total = initialData?.totalContributions ?? 552;

  const handleMouseEnter = (e: React.MouseEvent, tooltipText: string) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setHoveredDay({
      text: tooltipText,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const shift = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: shift, behavior: 'smooth' });
    }
  };

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scrollToRecent = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: scrollContainerRef.current.scrollWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950/80 to-black p-5 sm:p-8 shadow-2xl transition-all duration-300 hover:border-emerald-500/30">
      {/* Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 border-b border-zinc-800/60 pb-4 sm:pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-inner">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                GitHub Contributions
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              <span className="font-semibold text-zinc-200">{total}</span> contributions in the last year
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Active Navigation Arrow Buttons */}
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-full p-1 shadow-inner">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
              title="Slide Left (Earlier Months)"
              aria-label="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
              title="Slide Right (Recent Activity)"
              aria-label="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Scrollable Grid Container */}
      <div className="relative w-full overflow-hidden">
        <div 
          ref={scrollContainerRef}
          data-lenis-prevent
          onScroll={() => setHoveredDay(null)}
          onMouseLeave={() => setHoveredDay(null)}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth py-2 block"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <div className="w-max min-w-full flex justify-center px-4">
            {!mounted ? (
              <div className="h-[120px] w-[750px] animate-pulse bg-zinc-900/30 rounded-2xl" />
            ) : initialData && initialData.days.length > 0 ? (
              <ActivityCalendar
                data={initialData.days}
                colorScheme="dark"
                blockSize={11}
                blockMargin={3}
                blockRadius={2.5}
                fontSize={12}
                theme={{
                  dark: ['#18181b', '#064e3b', '#047857', '#059669', '#10b981'],
                }}
                renderBlock={(block, activity) => {
                  const tooltipText = formatDateTooltip(activity.count, activity.date);
                  return React.cloneElement(block, {
                    style: { cursor: 'pointer' },
                    onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, tooltipText),
                    onMouseLeave: () => setHoveredDay(null),
                  });
                }}
              />
            ) : (
              <GitHubCalendar
                username={username}
                colorScheme="dark"
                blockSize={11}
                blockMargin={3}
                blockRadius={2.5}
                fontSize={12}
                theme={{
                  dark: ['#18181b', '#064e3b', '#047857', '#059669', '#10b981'],
                }}
                renderBlock={(block, activity) => {
                  const tooltipText = formatDateTooltip(activity.count, activity.date);
                  return React.cloneElement(block, {
                    style: { cursor: 'pointer' },
                    onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, tooltipText),
                    onMouseLeave: () => setHoveredDay(null),
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick Jump Shortcuts */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40 mt-2 text-[11px] text-zinc-500">
        <button
          type="button"
          onClick={scrollToStart}
          className="hover:text-zinc-300 transition-colors cursor-pointer"
        >
          ← View earlier months
        </button>
        <button
          type="button"
          onClick={scrollToRecent}
          className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
        >
          Jump to latest →
        </button>
      </div>

      {/* Floating Pop-Up Hover Tooltip (Rendered via Portal to avoid clipping) */}
      {mounted && hoveredDay && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed z-[99999] pointer-events-none -translate-x-1/2 -translate-y-full px-3 py-1.5 bg-zinc-900/95 border border-zinc-700/90 text-xs font-semibold text-white rounded-xl shadow-2xl backdrop-blur-md transition-all duration-75 whitespace-nowrap animate-in fade-in zoom-in-95"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y}px`,
          }}
        >
          {hoveredDay.text}
          {/* Tooltip little downward arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-zinc-700/90" />
        </div>,
        document.body
      )}
    </div>
  );
}
