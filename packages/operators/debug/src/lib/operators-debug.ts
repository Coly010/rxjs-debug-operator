import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Observer } from 'rxjs/internal/types';

export interface DebugOperatorConfig<T> extends Omit<Observer<T>, 'closed'> {
  shouldIgnore: boolean;
  label: string;
  next: (value: T) => void;
  error: (value: unknown) => void;
  complete: () => void;
}

function createDefaultConfig<T>(label: string = null): DebugOperatorConfig<T> {
  return {
    shouldIgnore: false,
    label,
    next: label ? (v) => console.log(label, v) : console.log,
    error: label ? (e) => console.error(label, e) : console.error,
    complete: label ? () => console.log(`${label} completed`) : () => null,
  };
}

/**
 * Used to help debug the observable as it receives notifications
 *
 * @param config The config to be used to set up the operator
 */
export function debug<T>(
  config?: Partial<DebugOperatorConfig<T>> | string
): MonoTypeOperatorFunction<T> {
  const mergedConfig: DebugOperatorConfig<T> =
    typeof config === 'string'
      ? createDefaultConfig(config)
      : Object.assign(createDefaultConfig(config?.label), config);

  const { shouldIgnore, next, error, complete } = mergedConfig;

  return (source: Observable<T>) =>
    shouldIgnore ? source : source.pipe(tap(next, error, complete));
}
