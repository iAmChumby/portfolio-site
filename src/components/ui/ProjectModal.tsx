'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { XMarkIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { ProjectItem } from '@/types/content';

interface ProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll and prevent touch scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
    } else {
      // Restore body scroll and position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position without animation
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen || !project) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl max-h-[85vh] sm:max-h-[80vh] md:max-h-[75vh] lg:max-h-[70vh] xl:max-h-[80vh] bg-[#111111] border border-[#234d35] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative h-32 sm:h-36 md:h-40 lg:h-48 xl:h-56 bg-neu-bg-dark border-b border-[#234d35] flex-shrink-0 xl:px-16 2xl:px-24">
            <Image 
            src={project.image} 
            alt={project.title}
            fill
            className="object-cover xl:object-contain"
            />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2">{project.title}</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {project.technologies.map((tech: string) => (
                  <span key={tech} className="px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-[#4ade80] bg-[#4ade80]/10 rounded-full border border-[#4ade80]/20">
                  {tech}
                  </span>
              ))}
              </div>
              
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 md:mb-5">
                  {project.longDescription || project.description}
              </p>

              <div className="flex gap-2 sm:gap-3">
                  {project.url && project.url !== '#' && (
                      <button 
                          onClick={() => window.open(project.url, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#4ade80] text-black font-semibold rounded-lg hover:bg-[#22c55e] transition-colors text-xs sm:text-sm"
                      >
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Visit App
                      </button>
                  )}
                  {project.demo && project.demo !== '#' && (
                      <button 
                          onClick={() => window.open(project.demo, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#4ade80] text-black font-semibold rounded-lg hover:bg-[#22c55e] transition-colors text-xs sm:text-sm"
                      >
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Live Demo
                      </button>
                  )}
                  {project.code && project.code !== '#' && (
                      <button 
                          onClick={() => window.open(project.code, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-[#333] text-white font-semibold rounded-lg hover:bg-white/5 transition-colors text-xs sm:text-sm"
                      >
                      <CodeBracketIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      View Code
                      </button>
                  )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
