import { Observer } from 'rxjs/internal/types';
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

/**
 * @private DO NOT USE DIRECTLY
 */
export let GLOBAL_CONFIG: GlobalDebugConfig = createDefaultGlobalDebugConfig();

export function setGlobalDebugConfig(config: Partial<GlobalDebugConfig>) {
  GLOBAL_CONFIG = { ...GLOBAL_CONFIG, ...config };
}

export interface DebugOperatorConfig<T> extends Omit<Observer<T>, 'closed'> {
  shouldIgnore: boolean;
  label: string;
  next: (value: T) => void;
  error: (value: unknown) => void;
  complete: () => void;
}

export function createDefaultConfig<T>(
  label: string = null
): DebugOperatorConfig<T> {
  const { logger, prefix, shouldIgnore } = GLOBAL_CONFIG;

  if (!label && prefix) {
    label = prefix;
  } else if (label && prefix) {
    label = `${prefix} ${label}`;
  }

  return {
    shouldIgnore,
    label,
    next: label ? (v) => logger.log(label, v) : logger.log,
    error: label ? (e) => logger.error(label, e) : logger.error,
    complete: label ? () => logger.log(`${label} completed`) : () => null,
  };
}
