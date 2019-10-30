/** Display the log message for the stdout. */
export default class Logger {
  /** `true` to display the report. */
  private _available: boolean

  /**
   * Initialize instance.
   * @param available `true` to display the report.
   */
  constructor(available: boolean) {
    this._available = available
  }

  /**
   * Display a log message for the stdout.
   * @param args Message arguments.
   */
  log(...args: any[]) {
    if (this._available) {
      console.log(...args)
    }
  }

  /**
   * Display an error message for the stdout.
   * @param args Message arguments.
   */
  error(...args: any[]) {
    if (this._available) {
      console.error(...args)
    }
  }
}
