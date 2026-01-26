'use client';

import React from 'react';
import Image from 'next/image';
import { XMarkIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { ProjectItem } from '@/types/content';

interface ProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl bg-[#111111] border border-[#234d35] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="aspect-video relative bg-neu-bg-dark border-b border-[#234d35]">
            <Image 
            src={project.image} 
            alt={project.title}
            fill
            className="object-cover"
            />
        </div>

        <div className="p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech: string) => (
                <span key={tech} className="px-3 py-1 text-xs font-medium text-[#4ade80] bg-[#4ade80]/10 rounded-full border border-[#4ade80]/20">
                {tech}
                </span>
            ))}
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-8">
                {project.longDescription || project.description}
            </p>

            <div className="flex gap-4">
                {project.demo && project.demo !== '#' && (
                    <button 
                        onClick={() => window.open(project.demo, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#4ade80] text-black font-semibold rounded-lg hover:bg-[#22c55e] transition-colors"
                    >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    Live Demo
                    </button>
                )}
                {project.code && project.code !== '#' && (
                    <button 
                        onClick={() => window.open(project.code, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#333] text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
                    >
                    <CodeBracketIcon className="w-5 h-5" />
                    View Code
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
