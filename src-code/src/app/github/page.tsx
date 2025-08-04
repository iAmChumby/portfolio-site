import { GitHubStats } from '@/components/sections/GitHubStats'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GitHub Stats',
  description: 'Overview of my GitHub activity and contributions',
}

export default function GitHubPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              GitHub Statistics
            </h1>
            <p className="text-lg text-green-600 dark:text-gray-400">
              Overview of my GitHub activity and contributions
            </p>
          </div>
          
          <GitHubStats />
        </div>
      </div>
    </main>
  )
}