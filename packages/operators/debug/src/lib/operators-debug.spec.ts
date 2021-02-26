import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { debug } from './operators-debug';

describe('operators - debug', () => {
  beforeEach(() => (console.log = jest.fn()));

  it('should log value to the console', () => {
    // ARRANGE
    const obs$ = of('my test value');

    // ACT
    obs$.pipe(debug(), take(1)).subscribe();

    // ASSERT
    expect(console.log).toHaveBeenCalledWith('my test value');
  });

  it('should not log value to the console when shouldIgnore flag is set to true', () => {
    // ARRANGE
    const obs$ = of('my test value');

    // ACT
    obs$.pipe(debug({ shouldIgnore: true }), take(1)).subscribe();

    // ASSERT
    expect(console.log).not.toHaveBeenCalledWith('my test value');
  });
});
