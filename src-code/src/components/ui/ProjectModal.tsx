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
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !project) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl max-h-[70vh] bg-[#111111] border border-[#234d35] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="relative h-48 bg-neu-bg-dark border-b border-[#234d35] flex-shrink-0">
            <Image 
            src={project.image} 
            alt={project.title}
            fill
            className="object-cover"
            />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech: string) => (
                  <span key={tech} className="px-2.5 py-0.5 text-xs font-medium text-[#4ade80] bg-[#4ade80]/10 rounded-full border border-[#4ade80]/20">
                  {tech}
                  </span>
              ))}
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  {project.longDescription || project.description}
              </p>

              <div className="flex gap-3">
                  {project.demo && project.demo !== '#' && (
                      <button 
                          onClick={() => window.open(project.demo, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4ade80] text-black font-semibold rounded-lg hover:bg-[#22c55e] transition-colors text-sm"
                      >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      Live Demo
                      </button>
                  )}
                  {project.code && project.code !== '#' && (
                      <button 
                          onClick={() => window.open(project.code, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#333] text-white font-semibold rounded-lg hover:bg-white/5 transition-colors text-sm"
                      >
                      <CodeBracketIcon className="w-4 h-4" />
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
