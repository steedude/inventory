import { vi } from 'vitest'

interface TestErrorInput {
  statusCode: number
  statusMessage: string
}

vi.stubGlobal('createError', (input: TestErrorInput) => {
  return Object.assign(new Error(input.statusMessage), input)
})
