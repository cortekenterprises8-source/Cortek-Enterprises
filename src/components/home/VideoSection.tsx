import React from 'react';
import { CirclePlay, Play, ExternalLink } from 'lucide-react';
import { EDUCATIONAL_VIDEOS } from '../../data/mockVideos';
import { SITE_CONFIG } from '../../config/siteConfig';

export const VideoSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 flex items-center gap-1.5 font-mono">
              <CirclePlay className="w-4 h-4 text-red-600" />
              Cortek YouTube Education
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Learn Before You Buy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We create practical videos showing how to spot counterfeit parts, altered battery chips, and avoid common traps in the second-hand market.
            </p>
          </div>

          <a
            href={SITE_CONFIG.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer self-start md:self-auto"
          >
            <CirclePlay className="w-4 h-4" />
            <span>Subscribe @Cortekenterprises</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATIONAL_VIDEOS.map((video) => (
            <a
              key={video.id}
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl bg-white border border-slate-200 hover:border-red-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div>
                {/* Thumbnail Preview Area */}
                <div className={`relative h-48 w-full bg-gradient-to-br ${video.thumbnailGradient} flex items-center justify-center p-6 border-b border-slate-200`}>
                  <div className="w-14 h-14 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>

                  {/* Badges */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 text-slate-800 border border-slate-200 shadow-2xs">
                    {video.topic}
                  </span>

                  <span className="absolute bottom-3 right-3 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900/80 text-white">
                    {video.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {video.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                  <CirclePlay className="w-3.5 h-3.5 text-red-600" />
                  YouTube Channel
                </span>
                <span className="flex items-center gap-1 text-slate-700 group-hover:text-red-600 font-medium">
                  <span>Watch Video</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
