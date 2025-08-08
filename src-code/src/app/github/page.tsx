import GitHubStats from '@/components/sections/GitHubStats'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GitHub Stats',
  description: 'Overview of my GitHub activity and contributions',
}

export default function GitHubPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decoration - positioned behind spiral animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-20"></div>
      
      {/* Subtle blur overlay over spiral animation */}
      <div className="absolute inset-0 z-0 pointer-events-none"></div>

      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-white">
              GitHub <span className="text-white">Dashboard</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white/80 max-w-2xl mx-auto">
              Explore my GitHub activity, repositories, and contributions
            </p>
          </div>
          
          <div className="animate-fade-in animation-delay-200">
            <GitHubStats />
          </div>
        </div>
      </div>
    </main>
  )
}