'use client'

import { useCallback, useMemo } from 'react'
import { VariableSizeList as List } from 'react-window'

export interface VirtualScrollConfig {
  itemCount: number
  itemSize?: number | ((index: number) => number)
  height: number
  width?: number | string
  overscanCount?: number
}

export interface VirtualScrollItem {
  index: number
  style: React.CSSProperties
}

/**
 * Hook for managing virtual scrolling of large lists
 * Uses react-window for optimal performance with 100k+ items
 */
export function useVirtualScroll({
  itemCount,
  itemSize = 48,
  height,
  width = '100%',
  overscanCount = 5
}: VirtualScrollConfig) {
  // Estimate item height if using fixed size
  const getItemSize = useCallback((index: number) => {
    if (typeof itemSize === 'function') {
      return itemSize(index)
    }
    return itemSize as number
  }, [itemSize])

  // Calculate approximate scroll offset for a given item index
  const getOffsetForIndex = useCallback((index: number): number => {
    if (typeof itemSize === 'function') {
      // Sum all item heights up to the index
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += itemSize(i)
      }
      return offset
    }
    return index * (itemSize as number)
  }, [itemSize])

  return useMemo(() => ({
    itemCount,
    getItemSize,
    getOffsetForIndex,
    height,
    width,
    overscanCount
  }), [itemCount, getItemSize, getOffsetForIndex, height, width, overscanCount])
}

/**
 * Component wrapper for virtual list rendering
 * Handles item rendering with optimal performance
 */
export interface VirtualListProps<T> {
  items: T[]
  itemSize: number | ((index: number) => number)
  height: number
  width?: string | number
  overscanCount?: number
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode
  className?: string
  onScroll?: (scrollOffset: number, clientHeight: number) => void
}

export function VirtualList<T>({
  items,
  itemSize,
  height,
  width = '100%',
  overscanCount = 5,
  renderItem,
  className,
  onScroll
}: VirtualListProps<T>) {
  const listRef = React.useRef<List>(null)

  const handleScroll = useCallback(({ scrollOffset, clientHeight }: {
    scrollOffset: number
    clientHeight: number
  }) => {
    onScroll?.(scrollOffset, clientHeight)
  }, [onScroll])

  return (
    <List
      ref={listRef}
      height={height}
      itemCount={items.length}
      itemSize={typeof itemSize === 'function' ? itemSize : () => itemSize as number}
      width={width}
      overscanCount={overscanCount}
      onScroll={handleScroll}
      className={className}
    >
      {({ index, style }) => (
        <div key={index} style={style}>
          {renderItem(items[index], index, style)}
        </div>
      )}
    </List>
  )
}

// Import React for JSX
import React from 'react'