'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { adminApi } from '@/lib/api/admin'
import type { LogEntry, ConfigEntry, CreateConfigRequest } from '@/lib/api/admin'

interface AdminDataManagerProps {
  onDataUpdate?: () => void
}

interface EditableItem {
  id: string
  type: 'log' | 'system' | 'config'
  data: Record<string, unknown>
  isEditing: boolean
}

interface FormData {
  title?: string
  name?: string
  status?: string
  level?: string
  description?: string
  message?: string
  source?: string
  meta?: Record<string, unknown>
  [key: string]: unknown
}

export default function AdminDataManager({ onDataUpdate }: AdminDataManagerProps) {
  const [items, setItems] = useState<EditableItem[]>([])
  const [formData, setFormData] = useState<FormData>({})
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newItemType, setNewItemType] = useState<'log' | 'system' | 'config'>('log')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleCreate = async (type: string, data: Record<string, unknown>) => {
    setLoading(true)
    setError('')
    
    try {
      let createdItem: LogEntry | ConfigEntry | Record<string, unknown>
      
      if (type === 'log') {
        const logData = {
          timestamp: new Date().toISOString(),
          level: (data.level as 'error' | 'warn' | 'info' | 'debug') || 'info',
          message: (data.message as string) || '',
          source: (data.source as string) || 'manual',
          meta: (data.meta as Record<string, unknown>) || {} as Record<string, unknown>
        }
        createdItem = await adminApi.createLog(logData)
      } else if (type === 'config') {
        const configData: CreateConfigRequest = {
          key: (data.key as string) || '',
          value: data.value || '',
          description: data.description as string,
          category: data.category as string
        }
        createdItem = await adminApi.createConfig(configData)
      } else {
        throw new Error(`Unsupported item type: ${type}`)
      }
      
      const newItem: EditableItem = {
        id: createdItem.id || Date.now().toString(),
        type: type as 'log' | 'system' | 'config',
        data: createdItem as unknown as Record<string, unknown>,
        isEditing: false
      }
      
      setItems(prev => [...prev, newItem])
      setShowAddForm(false)
      onDataUpdate?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item'
      setError(errorMessage)
      console.error('Failed to create item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, updatedData: Record<string, unknown>) => {
    setLoading(true)
    setError('')
    
    try {
      const item = items.find(item => item.id === id)
      if (!item) {
        throw new Error('Item not found')
      }
      
      let updatedItem: LogEntry | ConfigEntry | Record<string, unknown>
      
      if (item.type === 'log') {
        updatedItem = await adminApi.updateLog(id, updatedData)
      } else if (item.type === 'config') {
        updatedItem = await adminApi.updateConfig(id, updatedData)
      } else {
        throw new Error(`Unsupported item type: ${item.type}`)
      }
      
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, data: updatedItem as unknown as Record<string, unknown>, isEditing: false }
          : item
      ))
      onDataUpdate?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item'
      setError(errorMessage)
      console.error('Failed to update item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    setLoading(true)
    setError('')
    
    try {
      const item = items.find(item => item.id === id)
      if (!item) {
        throw new Error('Item not found')
      }
      
      if (item.type === 'log') {
        await adminApi.deleteLog(id)
      } else if (item.type === 'config') {
        await adminApi.deleteConfig(id)
      } else {
        throw new Error(`Unsupported item type: ${item.type}`)
      }
      
      setItems(prev => prev.filter(item => item.id !== id))
      onDataUpdate?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item'
      setError(errorMessage)
      console.error('Failed to delete item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (item: EditableItem) => {
    if (editingItem?.id === item.id) {
      resetForm()
    } else {
      startEditing(item)
    }
  }

  const resetForm = () => {
    setFormData({})
    setEditingItem(null)
  }

  const startEditing = (item: EditableItem) => {
    setFormData(item.data as FormData)
    setEditingItem(item)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      handleUpdate(editingItem.id, formData)
    } else {
      handleCreate(newItemType, formData)
    }
    resetForm()
  }

  const renderItemForm = () => {

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title/Name
            </label>
            <input
              type="text"
              value={formData.title || formData.name || ''}
              onChange={(e) => setFormData((prev: FormData) => ({...prev, title: e.target.value, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status/Level
            </label>
            <select
              value={formData.status || formData.level || 'info'}
              onChange={(e) => setFormData((prev: FormData) => ({ ...prev, status: e.target.value, level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description/Message
          </label>
          <textarea
            value={formData.description || formData.message || ''}
            onChange={(e) => setFormData((prev: FormData) => ({ ...prev, description: e.target.value, message: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
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
            {editingItem ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (editingItem) {
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
          Data Management
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
          Add Item
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item Type
            </label>
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as 'log' | 'system' | 'config')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="log">Log Entry</option>
              <option value="system">System Info</option>
              <option value="config">Configuration</option>
            </select>
          </div>
          {renderItemForm()}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {editingItem?.id === item.id ? (
              renderItemForm()
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === 'log' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      item.type === 'system' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.data.status === 'error' || item.data.level === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      item.data.status === 'warning' || item.data.level === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {String(item.data.status || item.data.level || 'info')}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {String(item.data.title || item.data.name || 'Untitled')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {String(item.data.description || item.data.message || 'No description')}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => handleEditClick(item)}
                    variant="outline"
                    size="sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
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
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No items to manage yet</p>
            <p className="text-sm mt-1">Click &quot;Add Item&quot; to create your first entry</p>
          </div>
        )}
      </div>
    </div>
  )
}