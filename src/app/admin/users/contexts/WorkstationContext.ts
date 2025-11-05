import { createContext, useContext } from 'react'
import type { WorkstationContextType, QuickStatsData, UserFilters } from '../types/workstation'

const defaultQuickStats: QuickStatsData = {
  totalUsers: 0,
  activeUsers: 0,
  pendingApprovals: 0,
  inProgressWorkflows: 0,
  refreshedAt: new Date(),
}

const defaultFilters: UserFilters = {
  search: '',
  role: '',
  status: '',
  department: '',
  dateRange: 'all',
}

const defaultContextValue: WorkstationContextType = {
  // Layout State
  sidebarOpen: true,
  insightsPanelOpen: true,
  setSidebarOpen: () => {},
  setInsightsPanelOpen: () => {},

  // Filter State
  filters: defaultFilters,
  setFilters: () => {},

  // Quick Stats
  quickStats: defaultQuickStats,
  quickStatsRefreshing: false,
  refreshQuickStats: async () => {},

  // Selection State
  selectedUserIds: new Set(),
  setSelectedUserIds: () => {},

  // Bulk Actions
  bulkActionType: '',
  setBulkActionType: () => {},
  bulkActionValue: '',
  setBulkActionValue: () => {},
  applyBulkAction: async () => {},
  isApplyingBulkAction: false,
}

export const WorkstationContext = createContext<WorkstationContextType>(defaultContextValue)

/**
 * Hook to use the WorkstationContext
 * Provides access to layout state, filters, quick stats, and bulk actions
 * @returns {WorkstationContextType} The workstation context value
 * @throws {Error} If used outside of WorkstationProvider
 */
export function useWorkstationContext(): WorkstationContextType {
  const context = useContext(WorkstationContext)
  if (!context) {
    throw new Error('useWorkstationContext must be used within a WorkstationProvider')
  }
  return context
}
