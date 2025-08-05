import GitHubStats from '@/components/sections/GitHubStats'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GitHub Stats',
  description: 'Overview of my GitHub activity and contributions',
}

export default function GitHubPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              GitHub Dashboard
            </h1>
            <p className="text-lg text-accent">
              Explore my GitHub activity, repositories, and contributions
            </p>
          </div>
          
          <GitHubStats />
        </div>
      </div>
    </main>
  )
}