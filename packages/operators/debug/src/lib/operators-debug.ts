import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs/internal/types';

export function debug<T>(): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.pipe(tap(console.log));
}
