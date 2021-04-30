import { Observer } from 'rxjs';
import { GLOBAL_CONFIG } from './global-debug-config';

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
