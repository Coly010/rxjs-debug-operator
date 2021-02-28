import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Observer } from 'rxjs/internal/types';

export interface DebugOperatorConfig<T> extends Omit<Observer<T>, 'closed'> {
  shouldIgnore: boolean;
  next: (value: T) => void;
  error: (value: unknown) => void;
  complete: () => void;
}

function createDefaultConfig<T>(): DebugOperatorConfig<T> {
  return {
    shouldIgnore: false,
    next: console.log,
    error: console.error,
    complete: () => null,
  };
}

/**
 * Used to help debug the observable as it receives notifications
 *
 * @param config The config to be used to set up the operator
 */
export function debug<T>(
  config: Partial<DebugOperatorConfig<T>> = {}
): MonoTypeOperatorFunction<T> {
  const { shouldIgnore, next, error, complete } = Object.assign(
    createDefaultConfig(),
    config
  );

  return (source: Observable<T>) =>
    shouldIgnore ? source : source.pipe(tap(next, error, complete));
}
