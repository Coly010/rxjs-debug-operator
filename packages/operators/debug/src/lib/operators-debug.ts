import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs/internal/types';

interface DebugOperatorConfig {
  shouldIgnore: boolean;
}

const defaultConfig: DebugOperatorConfig = {
  shouldIgnore: false,
};

export function debug<T>(
  config: Partial<DebugOperatorConfig> = defaultConfig
): MonoTypeOperatorFunction<T> {
  const { shouldIgnore } = config;

  return (source: Observable<T>) =>
    shouldIgnore ? source : source.pipe(tap(console.log));
}
