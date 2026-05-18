import { describe, it, expect } from 'vitest'
import { formatDate } from '../date'

describe('formatDate', () => {
  it('formaterar datum korrekt i svenskt format', () => {
    const dateString = '2024-12-25T15:30:00'
    const formatted = formatDate(dateString)
    
    expect(formatted).toMatch(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/)
  })

  it('hanterar olika tidszoner korrekt', () => {
    const dateString = '2024-01-15T10:00:00Z'
    const formatted = formatDate(dateString)
    
    expect(formatted).toBeTruthy()
    expect(formatted).toContain('2024')
  })

  it('formaterar tid med ledande nollor i stockholm-tidszon', () => {
    const dateString = '2024-06-05T09:05:00Z'
    const formatted = formatDate(dateString)
    
    expect(formatted).toMatch(/11:05/)
  })
})
