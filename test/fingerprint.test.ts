import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fingerprintModule from '@/utils/fingerprint'

describe('Fingerprint Utility', () => {
  describe('generateFingerprint', () => {
    it('should generate a consistent fingerprint for the same environment', () => {
      // Mock the global objects that generateFingerprint uses
      global.document = {
        createElement: vi.fn(() => ({
          getContext: vi.fn(() => ({
            textBaseline: '',
            font: '',
            fillText: vi.fn(),
          })),
          toDataURL: vi.fn(() => 'mock-canvas-data'),
        })),
      } as any

      global.navigator = {
        userAgent: 'Mozilla/5.0 (Test Browser)',
      } as any

      Object.defineProperty(global, 'screen', {
        value: {
          width: 1920,
          height: 1080,
        },
        writable: true,
        configurable: true,
      })

      const dateSpy = vi.spyOn(Date.prototype, 'getTimezoneOffset')
      dateSpy.mockReturnValue(-480) // PST timezone

      const fingerprint1 = fingerprintModule.generateFingerprint()
      const fingerprint2 = fingerprintModule.generateFingerprint()

      expect(fingerprint1).toBe(fingerprint2)
      expect(fingerprint1).toMatch(/^[a-z0-9]+$/)
      expect(fingerprint1.length).toBeGreaterThan(2)

      dateSpy.mockRestore()
    })

    it('should generate different fingerprints for different environments', () => {
      // First environment
      global.navigator = { userAgent: 'Browser1' } as any
      Object.defineProperty(global, 'screen', {
        value: { width: 1920, height: 1080 },
        writable: true,
        configurable: true,
      })
      const fingerprint1 = fingerprintModule.generateFingerprint()

      // Second environment
      global.navigator = { userAgent: 'Browser2' } as any
      Object.defineProperty(global, 'screen', {
        value: { width: 1366, height: 768 },
        writable: true,
        configurable: true,
      })
      const fingerprint2 = fingerprintModule.generateFingerprint()

      expect(fingerprint1).not.toBe(fingerprint2)
    })
  })

  describe('isCurrentUserAuthor', () => {
    it('should return true when fingerprints match', () => {
      // Get the current fingerprint and test with the same value
      const currentFingerprint = fingerprintModule.generateFingerprint()
      const result = fingerprintModule.isCurrentUserAuthor(currentFingerprint)
      expect(result).toBe(true)
    })

    it('should return false when fingerprints do not match', () => {
      const authorFingerprint = 'different456'
      const result = fingerprintModule.isCurrentUserAuthor(authorFingerprint)
      expect(result).toBe(false)
    })
  })
})
