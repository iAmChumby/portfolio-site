import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

// Mock the data files
jest.mock('@/data/site-config.json', () => ({
  site: {
    author: {
      name: 'Test Author',
      bio: 'Test bio description',
      location: 'Test City, Test Country',
      email: 'test@example.com',
    },
    title: 'Test Developer',
    description: 'Test description for the site',
  },
  contact: {
    availability: 'Available for work',
  },
}));

jest.mock('@/data/projects.json', () => ({
  projects: [
    {
      id: 'test-project-1',
      title: 'Test Project 1',
      description: 'Test project description',
      technologies: ['React', 'TypeScript', 'Next.js'],
      githubUrl: 'https://github.com/test/project1',
      liveUrl: 'https://project1.example.com',
      featured: true,
    },
    {
      id: 'test-project-2',
      title: 'Test Project 2',
      description: 'Another test project',
      technologies: ['Node.js', 'Express'],
      githubUrl: 'https://github.com/test/project2',
      featured: false,
    },
  ],
}));

describe('Home Page', () => {
  it('renders the hero section with author information', () => {
    render(<Home />);
    
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Developer')).toBeInTheDocument();
    expect(screen.getByText('Test description for the site')).toBeInTheDocument();
  });

  it('renders the about section with author details', () => {
    render(<Home />);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Test bio description')).toBeInTheDocument();
    expect(screen.getByText('Test City, Test Country')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Available for work')).toBeInTheDocument();
  });

  it('renders featured projects section', () => {
    render(<Home />);
    
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test project description')).toBeInTheDocument();
    
    // Should only show featured projects
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('renders project technologies as tags', () => {
    render(<Home />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('renders contact CTA section', () => {
    render(<Home />);
    
    expect(screen.getByText("Let's Work Together")).toBeInTheDocument();
    expect(screen.getByText(/I'm always interested in new opportunities/)).toBeInTheDocument();
  });

  it('renders all main action buttons', () => {
    render(<Home />);
    
    expect(screen.getByText('View My Work')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByText('Learn More About Me')).toBeInTheDocument();
    expect(screen.getByText('View All Projects')).toBeInTheDocument();
    expect(screen.getByText('Start a Conversation')).toBeInTheDocument();
  });

  it('renders project action buttons for featured projects', () => {
    render(<Home />);
    
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Live Demo')).toBeInTheDocument();
  });
});