import { parseArgv } from './cli'

describe('CLI', () => {
  describe('input', () => {
    it('--input', () => {
      const argv = ['', '', '--input', './']
      const options = parseArgv(argv)
      expect(options.input).toBe('./')
      expect(options.output).toBeUndefined()
      expect(options.report).toBeFalsy()
    })

    it('-i', () => {
      const argv = ['', '', '-i', './']
      const options = parseArgv(argv)
      expect(options.input).toBe('./')
      expect(options.output).toBeUndefined()
      expect(options.report).toBeFalsy()
    })
  })

  // input is required, so it is an error if not specified
  describe('output', () => {
    it('--output', () => {
      const argv = ['', '', '--output', './']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBe('./')
      expect(options.report).toBeFalsy()
    })

    it('-o', () => {
      const argv = ['', '', '-o', './']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBe('./')
      expect(options.report).toBeFalsy()
    })
  })

  // input is required, so it is an error if not specified
  describe('report', () => {
    it('--report', () => {
      const argv = ['', '', '--report']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBeUndefined()
      expect(options.report).toBeTruthy()
    })

    it('-r', () => {
      const argv = ['', '', '-r']
      const options = parseArgv(argv)
      expect(options.input).toBeUndefined()
      expect(options.output).toBeUndefined()
      expect(options.report).toBeTruthy()
    })
  })
})
