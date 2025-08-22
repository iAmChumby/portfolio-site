'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { useLogs } from '@/lib/hooks/useAdmin'
import { adminApi } from '@/lib/api/admin'
import type { LogEntry } from '@/lib/api/admin'

interface LogsManagerProps {
  onDataUpdate?: () => void
}

export default function LogsManager({ onDataUpdate }: LogsManagerProps) {
  const [filters, setFilters] = useState({
    level: '',
    startDate: '',
    endDate: '',
    search: ''
  })
  const [page, setPage] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLog, setNewLog] = useState({
    level: 'info' as 'info' | 'warn' | 'error' | 'debug',
    message: '',
    source: '',
    metadata: '{}'
  })

  const {
    logs,
    loading,
    error,
    totalPages,
    currentPage,
    loadLogs,
    refreshLogs
  } = useLogs({
    page,
    limit: 10,
    level: filters.level || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    search: filters.search || undefined
  })

  useEffect(() => {
    loadLogs()
  }, [page, filters, loadLogs])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filtering
  }

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const logData = {
        timestamp: new Date().toISOString(),
        level: newLog.level,
        message: newLog.message,
        source: newLog.source || 'manual',
        meta: newLog.metadata ? JSON.parse(newLog.metadata) : {}
      }
      
      await adminApi.createLog(logData)
      
      setNewLog({
        level: 'info',
        message: '',
        source: '',
        metadata: '{}'
      })
      setShowAddForm(false)
      await refreshLogs()
      onDataUpdate?.()
    } catch (err) {
      console.error('Failed to create log:', err)
      alert('Failed to create log entry. Please try again.')
    }
  }

  const handleUpdateLog = async (log: LogEntry) => {
    try {
      await adminApi.updateLog(log.id, {
        level: log.level,
        message: log.message,
        source: log.source,
        meta: log.meta
      })
      
      resetForm()
      await refreshLogs()
      onDataUpdate?.()
    } catch (err) {
      console.error('Failed to update log:', err)
      alert('Failed to update log entry. Please try again.')
    }
  }

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return
    
    try {
      await adminApi.deleteLog(logId)
      await refreshLogs()
      onDataUpdate?.()
    } catch (err) {
      console.error('Failed to delete log:', err)
      alert('Failed to delete log entry. Please try again.')
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'debug':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  // Form state for log editing
  const [formData, setFormData] = useState<{
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    source: string;
    meta: Record<string, unknown>;
  }>({
    level: 'info',
    message: '',
    source: '',
    meta: {}
  })
  const [metadataStr, setMetadataStr] = useState('{}');
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);

  const resetForm = () => {
    setFormData({
      level: 'info',
      message: '',
      source: '',
      meta: {}
    });
    setMetadataStr('{}');
    setEditingLog(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const logData = {
        ...formData,
        meta: JSON.parse(metadataStr)
      };
      
      if (editingLog) {
        handleUpdateLog({ ...editingLog, ...logData });
      } else {
        handleCreateLog(e);
      }
      resetForm();
    } catch {
      alert('Invalid JSON in metadata field');
    }
  };

  const startEditing = (log: LogEntry) => {
    setFormData({
      level: log.level,
      message: log.message,
      source: log.source || '',
      meta: log.meta || {}
    });
    setMetadataStr(JSON.stringify(log.meta || {}, null, 2));
    setEditingLog(log);
  };

  const renderLogForm = () => {

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as 'info' | 'warn' | 'error' | 'debug' }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source
            </label>
            <input
              type="text"
              value={formData.source || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., api, frontend, database"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
            placeholder="Log message..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Metadata (JSON)
          </label>
          <textarea
            value={metadataStr}
            onChange={(e) => setMetadataStr(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="cta"
            size="sm"
          >
            {editingLog ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (editingLog) {
                resetForm()
              } else {
                setShowAddForm(false)
              }
            }}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Logs Management
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          variant="cta"
          size="sm"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Log
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search logs..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Log Entry</h3>
          {renderLogForm()}
        </div>
      )}

      {/* Logs List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading logs...</p>
          </div>
        )}
        
        {!loading && logs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No logs found</p>
            <p className="text-sm mt-1">Try adjusting your filters or add a new log entry</p>
          </div>
        )}
        
        {logs.map((log) => (
          <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {editingLog?.id === log.id ? (
              renderLogForm()
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    {log.source && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {log.source}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white mb-2">{log.message}</p>
                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                        View Metadata
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.meta, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => startEditing(log)}
                    variant="outline"
                    size="sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    onClick={() => handleDeleteLog(log.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}