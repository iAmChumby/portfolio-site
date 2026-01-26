'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

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
        className="w-full h-[600px] relative border border-[#234d35] rounded-xl bg-neu-bg-dark/50 overflow-hidden" 
        style={{ cursor: 'move' }}
    >
      <div className="absolute top-4 left-4 z-10 p-4 bg-neu-surface/90 backdrop-blur-sm rounded-lg border border-neu-border shadow-lg text-xs text-neu-text-secondary pointer-events-none select-none">
        <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#4fa36d] shadow-[0_0_10px_rgba(79,163,109,0.5)]"></span> 
            <span className="font-medium text-neu-text-primary">Projects</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#e2e8f0] shadow-[0_0_10px_rgba(226,232,240,0.5)]"></span> 
            <span className="font-medium text-neu-text-primary">Technologies</span>
        </div>
        <div className="h-px bg-neu-border mb-3"></div>
        <div className="space-y-1 text-[10px] uppercase tracking-wider opacity-80">
            <p>• Scroll to Zoom</p>
            <p>• Drag to Pan</p>
            <p>• Click to Expand</p>
        </div>
      </div>
      
      <button
        onClick={() => {
            fgRef.current?.zoomToFit(1000, 50);
            fgRef.current?.d3ReheatSimulation(); // Ensure physics settle if needed
        }}
        className="absolute bottom-4 right-4 bg-neu-surface/90 backdrop-blur-sm border border-neu-border text-neu-text-primary px-3 py-2 rounded-lg shadow-lg hover:bg-[#234d35] hover:text-white transition-colors text-xs font-medium z-10 flex items-center gap-2"
        aria-label="Reset View"
      >
        <ArrowPathIcon className="w-4 h-4" />
        Reset View
      </button>
      
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
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const label = node.name;
            const isProject = node.type === 'project';
            const radius = isProject ? 12 : 6;
            const fontSize = isProject ? 14/globalScale : 10/globalScale;
            const finalFontSize = Math.max(fontSize, 4); 

            // Animated Pulse for Projects
            if (isProject) {
              const time = Date.now();
              const pulse = (Math.sin(time / 400) + 1) / 2; // 0 to 1 oscillating
              const pulseSize = radius + 4 + (pulse * 3); // Ring expands
              const pulseOpacity = 0.5 - (pulse * 0.3); // Fades out as expanding

              // Pulse Ring
              ctx.beginPath();
              ctx.arc(node.x, node.y, pulseSize, 0, 2 * Math.PI, false);
              ctx.strokeStyle = `rgba(79, 163, 109, ${pulseOpacity})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            // Draw Node Body
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = isProject ? '#4fa36d' : '#e2e8f0';
            ctx.fill();
            
            // Inner Solid Border for Project
            if (isProject) {
                ctx.strokeStyle = '#2a4a35';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw Label Logic (Semantic Zoom)
            const showLabel = isProject || (globalScale > 1.2);

            if (showLabel) {
                ctx.font = `${finalFontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textAlpha = isProject ? 1 : Math.min(1, (globalScale - 1.2) * 2); // Fade in tech labels
                ctx.fillStyle = isProject ? '#ffffff' : `rgba(255,255,255,${textAlpha})`;
                
                // Draw text below the node
                const textOffset = radius + finalFontSize + (isProject ? 4 : 2); 
                ctx.fillText(label, node.x, node.y + textOffset);
            }
        }}
        
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
             const isProject = node.type === 'project';
             const radius = isProject ? 12 : 6;
             ctx.beginPath();
             ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI, false); // Generous hit area for easy clicking
             ctx.fillStyle = color;
             ctx.fill();
        }}
        
        // Interaction Settings
        enableZoom={true}
        enablePan={true}
        enableNodeDrag={false} // Disabled to prioritize clicking
        enablePointerInteraction={true}
        onNodeHover={(node: any) => {
            if (containerRef.current) {
                // Pointer for all nodes since they are all interactive (Click or Center)
                containerRef.current.style.cursor = node ? 'pointer' : 'move'; 
            }
        }}
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
            // 1. Fit the graph first
            fgRef.current?.zoomToFit(400, 50);
            
            // 2. Restart simulation at low alpha to keep the render loop active for animations
            // waiting a tick prevents conflict with zoomToFit (sometimes)
            setTimeout(() => {
                if (fgRef.current) {
                    fgRef.current.d3Force('charge').strength(-180); // Re-assert physics
                    fgRef.current.d3AlphaTarget(0.01).restart(); // Keep-alive for animation
                }
            }, 500);
        }}
      />
    </div>
  );
}
