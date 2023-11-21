/**
 * Phase configuration object
 */
export interface PhaseConfig {
  scripts: {
    app: string,
    build?: string,
    start?: string,
    dev?: string
  }[]
}