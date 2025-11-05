'use client'

import React from 'react'
import type { UserItem } from '../../contexts/UsersContextProvider'
import { WorkstationProvider } from '../../contexts/WorkstationProvider'
import { WorkstationIntegrated } from '../workstation/WorkstationIntegrated'
import { ExecutiveDashboardTab } from './ExecutiveDashboardTab'

interface ExecutiveDashboardTabWrapperProps {
  users: UserItem[]
  stats: any
  isLoading?: boolean
  onAddUser?: () => void
  onImport?: () => void
  onBulkOperation?: () => void
  onExport?: () => void
  onRefresh?: () => void
}

/**
 * ExecutiveDashboardTabWrapper
 *
 * Phase 2: Wraps ExecutiveDashboardTab with feature flag support
 * - If NEXT_PUBLIC_WORKSTATION_ENABLED is true, uses WorkstationIntegrated layout
 * - If false, uses the original ExecutiveDashboardTab (tab-based UI)
 *
 * This enables safe rollout and A/B testing of the new workstation redesign.
 */
export function ExecutiveDashboardTabWrapper({
  users,
  stats,
  isLoading,
  onAddUser,
  onImport,
  onBulkOperation,
  onExport,
  onRefresh,
}: ExecutiveDashboardTabWrapperProps) {
  const isWorkstationEnabled = process.env.NEXT_PUBLIC_WORKSTATION_ENABLED === 'true'

  if (isWorkstationEnabled) {
    return (
      <WorkstationProvider>
        <WorkstationIntegrated
          users={users}
          stats={stats}
          isLoading={isLoading}
          onAddUser={onAddUser}
          onImport={onImport}
          onBulkOperation={onBulkOperation}
          onExport={onExport}
          onRefresh={onRefresh}
        />
      </WorkstationProvider>
    )
  }

  // Fallback to old tab-based UI
  return (
    <ExecutiveDashboardTab
      users={users}
      stats={stats}
      isLoading={isLoading}
      onAddUser={onAddUser}
      onImport={onImport}
      onBulkOperation={onBulkOperation}
      onExport={onExport}
      onRefresh={onRefresh}
    />
  )
}
