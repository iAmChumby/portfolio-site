'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { ProjectItem } from '@/types/content';

// Dynamic import for client-side only rendering
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] flex items-center justify-center text-gray-400">Loading Graph...</div>
});

interface GraphNode {
  id: string | number;
  name: string;
  type: 'project' | 'tech';
  group: number;
  val: number;
  x?: number;
  y?: number;
}

interface ProjectGraphProps {
  projects: ProjectItem[];
  onNodeClick: (node: ProjectItem) => void;
}

export default function ProjectGraph({ projects, onNodeClick }: ProjectGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Process data into nodes and links
    const nodes: any[] = [];
    const links: any[] = [];
    const addedTechs = new Set();

    projects.forEach(project => {
      // Add Project Node
      nodes.push({
        id: project.id,
        name: project.title,
        type: 'project',
        group: 1,
        // Calculate size based on something? Or fixed.
        val: 25
      });

      project.technologies.forEach((tech: string) => {
        // Add Tech Node if not exists
        if (!addedTechs.has(tech)) {
          nodes.push({
            id: tech,
            name: tech,
            type: 'tech',
            group: 2,
            val: 10
          });
          addedTechs.add(tech);
        }

        // Link Project to Tech
        links.push({
          source: project.id,
          target: tech,
          color: '#2a4a35' // subtle link color
        });
      });
    });

    setGraphData({ nodes, links } as any);
  }, [projects]);

  // Adjust physics forces
  useEffect(() => {
    if (fgRef.current) {
        // Strong repulsion to keep everything clear
        fgRef.current.d3Force('charge').strength(-300);
        
        // LARGE link distance to separate tech nodes from projects
        fgRef.current.d3Force('link').distance(100);
        
        // Center force to keep it in view
        if (fgRef.current.d3Force('center')) {
             fgRef.current.d3Force('center').strength(0.1); 
        }
    }
  }, [graphData]);

  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        }
    };
    
    // Initial resize
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
        ref={containerRef} 
        className="w-full h-[600px] relative" 
        style={{ cursor: 'move' }}
    >
      <div className="absolute top-4 left-4 z-10 p-2 text-xs text-neu-text-secondary pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#4fa36d] shadow-[0_0_10px_rgba(79,163,109,0.5)]"></span> Projects
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#e2e8f0] shadow-[0_0_10px_rgba(226,232,240,0.5)]"></span> Technologies
        </div>
      </div>
      
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        linkColor={() => 'rgba(255, 255, 255, 0.15)'}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        backgroundColor="rgba(0,0,0,0)"

        // Custom Rendering for Persistent Labels and controlled size
        nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const isProject = node.type === 'project';
            // Manual radius: Projects Big (12), Tech Small (6)
            const radius = isProject ? 12 : 6;
            const fontSize = isProject ? 14/globalScale : 10/globalScale; // Scale text so it remains readable but zoom-aware
            
            // Limit min font size for readability
            const finalFontSize = Math.max(fontSize, 4); 

            // Draw Node
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = isProject ? '#4fa36d' : '#e2e8f0';
            ctx.fill();
            
            // Draw Glow for Projects
            if (isProject) {
              ctx.shadowColor = 'rgba(79, 163, 109, 0.4)';
              ctx.shadowBlur = 15;
              ctx.strokeStyle = '#4fa36d';
              ctx.stroke();
              ctx.shadowBlur = 0;
            }

            // Draw Label Logic
            // Project: Always visible.
            // Tech: Visible if zoomed in (globalScale > 1.2) - adjusted threshold for feel
            const showLabel = isProject || (globalScale > 1.2);

            if (showLabel) {
                ctx.font = `${finalFontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isProject ? '#ffffff' : 'rgba(255,255,255,0.8)';
                
                // Draw text below the node
                const textOffset = radius + finalFontSize; 
                ctx.fillText(label, node.x, node.y + textOffset);
            }
        }}
        
        nodePointerAreaPaint={(node: any, color, ctx) => {
             const isProject = node.type === 'project';
             const radius = isProject ? 12 : 6;
             ctx.beginPath();
             ctx.arc(node.x, node.y, radius + 2, 0, 2 * Math.PI, false);
             ctx.fillStyle = color;
             ctx.fill();
        }}
        
        // Interaction Settings
        enableZoom={true}
        enablePan={true}
        enableNodeDrag={true}
        onNodeClick={(node: any) => {
            if (node.type === 'project') {
                const p = projects.find(p => p.id === node.id);
                if (p) onNodeClick(p);
            } else {
                fgRef.current?.centerAt(node.x, node.y, 1000);
                fgRef.current?.zoom(3, 1000);
            }
        }}

        cooldownTicks={100}
        d3VelocityDecay={0.3}
        onEngineStop={() => {
            fgRef.current?.zoomToFit(400, 50);
        }}
      />
    </div>
  );
}
