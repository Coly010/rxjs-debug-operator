import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs/internal/types';
import { createDefaultConfig, DebugOperatorConfig } from './debug-config';
import { DebugLogger } from './debug-logger';
import { GLOBAL_CONFIG } from './global-debug-config';

/**
 * Used to help debug the observable as it receives notifications
 *
 * @param config The config to be used to set up the operator
 */
export function debug<T>(
  config?:
    | Partial<DebugOperatorConfig<T>>
    | ((logger: DebugLogger) => Partial<DebugOperatorConfig<T>>)
    | string
): MonoTypeOperatorFunction<T> {
  let mergedConfig: DebugOperatorConfig<T>;

  if (typeof config === 'string') {
    mergedConfig = createDefaultConfig(config);
  } else if (typeof config === 'function') {
    mergedConfig = {
      ...createDefaultConfig(),
      ...config(GLOBAL_CONFIG.logger),
    };
  } else {
    mergedConfig = { ...createDefaultConfig(config?.label), ...config };
  }

  const { shouldIgnore, next, error, complete } = mergedConfig;

  return (source: Observable<T>) =>
    shouldIgnore ? source : source.pipe(tap(next, error, complete));
}
