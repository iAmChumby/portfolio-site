'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import * as d3Force from 'd3-force';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, ZoomBehavior } from 'd3-zoom';

import { ProjectItem } from '@/types/content';

interface GraphNode {
  id: string | number;
  label: string;
  type: 'project' | 'tech';
  size: number;
  color: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | number | GraphNode;
  target: string | number | GraphNode;
  type: string;
}

interface ProjectGraphProps {
  projects: ProjectItem[];
  onNodeClick: (node: ProjectItem) => void;
}

export default function ProjectGraph({ projects, onNodeClick }: ProjectGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<any>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Convert projects data to react-d3-graph format
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const addedTechs = new Set<string>();

    projects.forEach(project => {
      // Add Project Node
      nodes.push({
        id: project.id,
        label: project.title,
        type: 'project',
        size: 400,
        color: '#4fa36d'
      });

      project.technologies.forEach((tech: string) => {
        // Add Tech Node if not exists
        if (!addedTechs.has(tech)) {
          nodes.push({
            id: tech,
            label: tech,
            type: 'tech',
            size: 200,
            color: '#e2e8f0'
          });
          addedTechs.add(tech);
        }

        // Link Project to Tech
        links.push({
          source: project.id,
          target: tech,
          type: 'project-tech'
        });
      });
    });

    return { nodes, links };
  }, [projects]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth || 800;
        const height = containerRef.current.offsetHeight || 500;
        if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Force Simulation with Zoom and Pan
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Create zoom container
    const zoomContainer = svg.append('g').attr('class', 'zoom-container');

    // Create simulation
    const simulation = d3Force.forceSimulation(graphData.nodes as any)
      .force('link', d3Force.forceLink(graphData.links).id((d: any) => d.id).distance(120))
      .force('charge', d3Force.forceManyBody().strength(-400))
      .force('center', d3Force.forceCenter(width / 2, height / 2))
      .force('collision', d3Force.forceCollide().radius((d: any) => d.type === 'project' ? 60 : 25));

    simulationRef.current = simulation;

    // Create links
    const link = zoomContainer.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 1.5);

    // Create nodes group
    const node = zoomContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add animated pulse ring for project nodes
    node.filter((d: GraphNode) => d.type === 'project')
      .append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', 20)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(79, 163, 109, 0.6)')
      .attr('stroke-width', 2)
      .style('animation', 'pulse 2s ease-in-out infinite');

    // Add main circles with proper sizing and styling
    node.append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => d.type === 'project' ? 16 : 8)
      .attr('fill', (d) => d.color)
      .attr('stroke', (d) => d.type === 'project' ? '#2a4a35' : 'none')
      .attr('stroke-width', (d) => d.type === 'project' ? 2 : 0);

    // Add labels with conditional visibility
    node.append('text')
      .attr('class', 'node-label')
      .text((d) => d.label)
      .attr('font-size', (d) => d.type === 'project' ? 42 : 14)
      .attr('font-weight', (d) => d.type === 'project' ? 700 : 400)
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.type === 'project' ? 16 : 8) + 28)
      .style('opacity', (d) => d.type === 'project' ? 1 : 0)
      .style('transition', 'opacity 0.3s ease')
      .style('text-shadow', (d) => d.type === 'project' ? '0 2px 8px rgba(0,0,0,0.8)' : 'none');

    // Setup zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        zoomContainer.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
        
        // Update tech label visibility based on zoom level
        node.selectAll('.node-label')
          .style('opacity', function(d: any) {
            if (d.type === 'project') return 1;
            return event.transform.k > 1.2 ? 1 : 0;
          });
      });

    svg.call(zoomBehavior);
    zoomBehaviorRef.current = zoomBehavior;

    // Set initial cursor
    svg.style('cursor', 'move');

    // Node interaction handlers
    node.on('mouseenter', function() {
      select(this).select('.node-circle')
        .transition()
        .duration(200)
        .attr('r', function(d: any) {
          return (d.type === 'project' ? 16 : 8) * 1.2;
        });
      svg.style('cursor', 'pointer');
    })
    .on('mouseleave', function() {
      select(this).select('.node-circle')
        .transition()
        .duration(200)
        .attr('r', (d: any) => d.type === 'project' ? 16 : 8);
      svg.style('cursor', 'move');
    })
    .on('click', (_event, d) => {
      _event.stopPropagation();
      if (d.type === 'project') {
        const project = projects.find(p => p.id === d.id);
        if (project) onNodeClick(project);
      } else {
        // Zoom to tech node
        const transform = zoomIdentity
          .translate(width / 2, height / 2)
          .scale(2.5)
          .translate(-d.x!, -d.y!);
        
        svg.transition()
          .duration(1000)
          .call(zoomBehavior.transform, transform);
      }
    });

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, projects, onNodeClick]);

  // Reset view function - fit graph to viewport
  const handleResetView = () => {
    if (!svgRef.current || !zoomBehaviorRef.current || graphData.nodes.length === 0) return;

    const svg = select(svgRef.current);
    
    // Calculate bounding box of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    graphData.nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        const radius = node.type === 'project' ? 16 : 8;
        minX = Math.min(minX, node.x - radius);
        minY = Math.min(minY, node.y - radius);
        maxX = Math.max(maxX, node.x + radius);
        maxY = Math.max(maxY, node.y + radius);
      }
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const graphCenterX = (minX + maxX) / 2;
    const graphCenterY = (minY + maxY) / 2;

    // Calculate scale to fit with padding
    const padding = 50;
    const scaleX = (dimensions.width - padding * 2) / graphWidth;
    const scaleY = (dimensions.height - padding * 2) / graphHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1x

    // Calculate transform to center and fit
    const transform = zoomIdentity
      .translate(dimensions.width / 2, dimensions.height / 2)
      .scale(scale)
      .translate(-graphCenterX, -graphCenterY);

    // Animate to fit
    svg.transition()
      .duration(1000)
      .call(zoomBehaviorRef.current.transform, transform);

    // Restart simulation with low alpha to settle
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] relative border border-[#234d35] rounded-xl bg-neu-bg-dark/50 overflow-hidden" 
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
        onClick={handleResetView}
        className="absolute bottom-4 right-4 bg-neu-surface/90 backdrop-blur-sm border border-neu-border text-neu-text-primary px-3 py-2 rounded-lg shadow-lg hover:bg-[#234d35] hover:text-white transition-colors text-xs font-medium z-10 flex items-center gap-2"
        aria-label="Reset View"
      >
        <ArrowPathIcon className="w-4 h-4" />
        Reset View
      </button>
      
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            r: 20px;
            opacity: 0.6;
          }
          50% {
            r: 24px;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
