import { DebugLogger, defaultLogger } from './debug-logger';

export interface GlobalDebugConfig {
  logger: DebugLogger;
  prefix: string;
  shouldIgnore: boolean;
}

export function createDefaultGlobalDebugConfig() {
  return {
    logger: defaultLogger,
    prefix: null,
    shouldIgnore: false,
  };
}

export function setGlobalDebugConfig(config: Partial<GlobalDebugConfig>) {
  GLOBAL_CONFIG = { ...GLOBAL_CONFIG, ...config };
}

/**
 * @private DO NOT USE DIRECTLY
 */
export let GLOBAL_CONFIG: GlobalDebugConfig = createDefaultGlobalDebugConfig();
