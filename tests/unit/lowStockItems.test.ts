import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchLowStockItems } from '~~/server/utils/lowStockItems'

const { query, useSupabaseServiceClientMock } = vi.hoisted(() => {
  const queryMock = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    overrideTypes: vi.fn(),
  }

  queryMock.select.mockReturnValue(queryMock)
  queryMock.eq.mockReturnValue(queryMock)
  queryMock.order.mockReturnValue(queryMock)

  return {
    query: queryMock,
    useSupabaseServiceClientMock: vi.fn(() => ({
      from: vi.fn(() => queryMock),
    })),
  }
})

describe('fetchLowStockItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('useSupabaseServiceClient', useSupabaseServiceClientMock)
    query.select.mockReturnValue(query)
    query.eq.mockReturnValue(query)
    query.order.mockReturnValue(query)
  })

  it('returns only items at or below their minimum quantity', async () => {
    query.overrideTypes.mockResolvedValue({
      data: [
        { user_id: 'user-1', name: 'Low', quantity: 1, min_quantity: 2 },
        { user_id: 'user-1', name: 'Equal', quantity: 2, min_quantity: 2 },
        { user_id: 'user-1', name: 'Enough', quantity: 3, min_quantity: 2 },
      ],
      error: null,
    })

    await expect(fetchLowStockItems()).resolves.toEqual([
      { user_id: 'user-1', name: 'Low', quantity: 1, min_quantity: 2 },
      { user_id: 'user-1', name: 'Equal', quantity: 2, min_quantity: 2 },
    ])
  })

  it('limits manual checks to the requested user', async () => {
    query.overrideTypes.mockResolvedValue({ data: [], error: null })

    await fetchLowStockItems('user-1')

    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1')
  })

  it('throws when Supabase returns an error', async () => {
    query.overrideTypes.mockResolvedValue({
      data: null,
      error: { message: 'Database unavailable' },
    })

    await expect(fetchLowStockItems()).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Database unavailable',
    })
  })
})
