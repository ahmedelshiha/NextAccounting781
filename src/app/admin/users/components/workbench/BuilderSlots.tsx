'use client'

import React from 'react'
import { useBuilderContent, useIsBuilderEnabled } from '@/hooks/useBuilderContent'
import { BUILDER_MODELS } from '@/lib/builder-io/config'
import QuickActionsBar from '../QuickActionsBar'
import OverviewCards from './OverviewCards'
import AdminSidebar from './AdminSidebar'
import BulkActionsPanel from './BulkActionsPanel'

/**
 * Builder.io content slot wrapper for header section
 *
 * Renders Builder.io content if available, otherwise renders default QuickActionsBar
 */
export function BuilderHeaderSlot() {
  const { content, isLoading, error, isEnabled } = useBuilderContent(
    BUILDER_MODELS.ADMIN_WORKBENCH_HEADER
  )

  if (!isEnabled) {
    return <QuickActionsBar />
  }

  if (isLoading) {
    return <QuickActionsBar /> // Show default while loading
  }

  if (error) {
    console.warn(`Failed to load Builder.io header content: ${error}`)
    return <QuickActionsBar /> // Fallback to default on error
  }

  if (!content) {
    return <QuickActionsBar /> // No content available
  }

  // Render Builder content
  // This would be handled by @builder.io/react BuilderContent component
  // when full Builder.io SDK integration is complete
  return (
    <div data-builder-model={BUILDER_MODELS.ADMIN_WORKBENCH_HEADER}>
      {content.blocks ? (
        <div>{/* Render builder blocks */}</div>
      ) : (
        <QuickActionsBar />
      )}
    </div>
  )
}

/**
 * Builder.io content slot wrapper for metrics/KPI section
 *
 * Renders Builder.io content if available, otherwise renders default OverviewCards
 */
export function BuilderMetricsSlot() {
  const { content, isLoading, error, isEnabled } = useBuilderContent(
    BUILDER_MODELS.ADMIN_WORKBENCH_METRICS
  )

  if (!isEnabled) {
    return <OverviewCards />
  }

  if (isLoading) {
    return <OverviewCards /> // Show default while loading
  }

  if (error) {
    console.warn(`Failed to load Builder.io metrics content: ${error}`)
    return <OverviewCards /> // Fallback to default on error
  }

  if (!content) {
    return <OverviewCards /> // No content available
  }

  return (
    <div data-builder-model={BUILDER_MODELS.ADMIN_WORKBENCH_METRICS}>
      {content.blocks ? (
        <div>{/* Render builder blocks */}</div>
      ) : (
        <OverviewCards />
      )}
    </div>
  )
}

/**
 * Builder.io content slot wrapper for sidebar section
 *
 * Renders Builder.io content if available, otherwise renders default AdminSidebar
 */
export function BuilderSidebarSlot(props: Parameters<typeof AdminSidebar>[0]) {
  const { content, isLoading, error, isEnabled } = useBuilderContent(
    BUILDER_MODELS.ADMIN_WORKBENCH_SIDEBAR
  )

  if (!isEnabled) {
    return <AdminSidebar {...props} />
  }

  if (isLoading) {
    return <AdminSidebar {...props} /> // Show default while loading
  }

  if (error) {
    console.warn(`Failed to load Builder.io sidebar content: ${error}`)
    return <AdminSidebar {...props} /> // Fallback to default on error
  }

  if (!content) {
    return <AdminSidebar {...props} /> // No content available
  }

  return (
    <div data-builder-model={BUILDER_MODELS.ADMIN_WORKBENCH_SIDEBAR}>
      {content.blocks ? (
        <div>{/* Render builder blocks */}</div>
      ) : (
        <AdminSidebar {...props} />
      )}
    </div>
  )
}

/**
 * Builder.io content slot wrapper for footer section
 *
 * Renders Builder.io content if available, otherwise renders default BulkActionsPanel
 */
export function BuilderFooterSlot(props: Parameters<typeof BulkActionsPanel>[0]) {
  const { content, isLoading, error, isEnabled } = useBuilderContent(
    BUILDER_MODELS.ADMIN_WORKBENCH_FOOTER
  )

  if (!isEnabled) {
    return <BulkActionsPanel {...props} />
  }

  if (isLoading) {
    return <BulkActionsPanel {...props} /> // Show default while loading
  }

  if (error) {
    console.warn(`Failed to load Builder.io footer content: ${error}`)
    return <BulkActionsPanel {...props} /> // Fallback to default on error
  }

  if (!content) {
    return <BulkActionsPanel {...props} /> // No content available
  }

  return (
    <div data-builder-model={BUILDER_MODELS.ADMIN_WORKBENCH_FOOTER}>
      {content.blocks ? (
        <div>{/* Render builder blocks */}</div>
      ) : (
        <BulkActionsPanel {...props} />
      )}
    </div>
  )
}
