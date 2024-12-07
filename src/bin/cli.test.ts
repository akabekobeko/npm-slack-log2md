import { describe, test, expect } from 'vitest'
import { parseArgv } from './cli'

describe('CLI', () => {
  describe('input', () => {
    test('--input', () => {
      const argv = ['', '', '--input', './']
      const options = parseArgv(argv)
      expect(options.input).toBe('./')
      expect(options.output).toBeUndefined()
      expect(options.report).toBeFalsy()
    })

    test('-i', () => {
      const argv = ['', '', '-i', './']
      const options = parseArgv(argv)
      expect(options.input).toBe('./')
      expect(options.output).toBeUndefined()
      expect(options.report).toBeFalsy()
    })
  })

  // input is required, so it is an error if not specified
  describe('output', () => {
    test('--output', () => {
      const argv = ['', '', '--output', './']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBe('./')
      expect(options.report).toBeFalsy()
    })

    test('-o', () => {
      const argv = ['', '', '-o', './']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBe('./')
      expect(options.report).toBeFalsy()
    })
  })

  // input is required, so it is an error if not specified
  describe('report', () => {
    test('--report', () => {
      const argv = ['', '', '--report']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBeUndefined()
      expect(options.report).toBeTruthy()
    })

    test('-r', () => {
      const argv = ['', '', '-r']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBeUndefined()
      expect(options.report).toBeTruthy()
    })
  })
})
