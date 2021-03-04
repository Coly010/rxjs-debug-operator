import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { debug, DebugOperatorConfig } from './operators-debug';

describe('operators - debug', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('when shouldIgnore is false', () => {
    it('should log value to the console when next notification receieved', () => {
      // ARRANGE
      const obs$ = of('my test value');

      // ACT
      obs$.pipe(debug()).subscribe();

      // ASSERT
      expect(console.log).toHaveBeenCalledWith('my test value');
    });

    it('should error value to the console when error notification receieved', () => {
      // ARRANGE
      const obs$ = throwError('my error value');

      // ACT
      obs$.pipe(debug()).subscribe();

      // ASSERT
      expect(console.error).toHaveBeenCalledWith('my error value');
    });
  });

  describe('when shouldIgnore is true', () => {
    it('should not log value to the console when next notification receieved', () => {
      // ARRANGE
      const obs$ = of('my test value');

      // ACT
      obs$.pipe(debug({ shouldIgnore: true })).subscribe();

      // ASSERT
      expect(console.log).not.toHaveBeenCalledWith('my test value');
    });

    it('should not error value to the console when error notification receieved', () => {
      // ARRANGE
      const obs$ = throwError('my error value');

      // ACT
      obs$.pipe(debug({ shouldIgnore: true })).subscribe();

      // ASSERT
      expect(console.error).not.toHaveBeenCalledWith('my error value');
    });
  });

  describe('when custom handlers are used', () => {
    let config: Partial<DebugOperatorConfig<string>>;

    beforeEach(
      () =>
        (config = {
          shouldIgnore: false,
          next: (value) => console.log('I received: ', value),
          error: (value) => console.error('I received: ', value),
          complete: () => console.log('I received a completion'),
        })
    );

    describe('and when shouldIgnore is false', () => {
      beforeEach(() => (config.shouldIgnore = false));

      it('should log value to the console when next notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).toHaveBeenCalledWith(
          'I received: ',
          'my test value'
        );
      });

      it('should error value to the console when error notification receieved', () => {
        // ARRANGE
        const obs$ = throwError('my error value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.error).toHaveBeenCalledWith(
          'I received: ',
          'my error value'
        );
      });

      it('should log value to the console when complete notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).toHaveBeenCalledTimes(2);
        expect(console.log).toHaveBeenNthCalledWith(
          2,
          'I received a completion'
        );
      });
    });

    describe('and when shouldIgnore is true', () => {
      beforeEach(() => (config.shouldIgnore = true));

      it('should log value to the console when next notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).not.toHaveBeenCalledWith(
          'I received: ',
          'my test value'
        );
      });

      it('should error value to the console when error notification receieved', () => {
        // ARRANGE
        const obs$ = throwError('my error value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.error).not.toHaveBeenCalledWith(
          'I received: ',
          'my error value'
        );
      });

      it('should log value to the console when complete notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).not.toHaveBeenCalledTimes(2);
        expect(console.log).not.toHaveBeenNthCalledWith(
          2,
          'I received a completion'
        );
      });
    });
  });

  describe('when a mix of custom and default handlers are used', () => {
    let config: Partial<DebugOperatorConfig<string>>;

    beforeEach(
      () =>
        (config = {
          shouldIgnore: false,
          next: (value) => console.log('I received: ', value),
          complete: () => console.log('I received a completion'),
        })
    );

    describe('and when shouldIgnore is false', () => {
      beforeEach(() => (config.shouldIgnore = false));

      it('should log value to the console when next notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).toHaveBeenCalledWith(
          'I received: ',
          'my test value'
        );
      });

      it('should error value to the console when error notification receieved', () => {
        // ARRANGE
        const obs$ = throwError('my error value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.error).toHaveBeenCalledWith('my error value');
      });

      it('should log value to the console when complete notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).toHaveBeenCalledTimes(2);
        expect(console.log).toHaveBeenNthCalledWith(
          2,
          'I received a completion'
        );
      });
    });

    describe('and when shouldIgnore is true', () => {
      beforeEach(() => (config.shouldIgnore = true));

      it('should not log value to the console when next notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).not.toHaveBeenCalledWith(
          'I received: ',
          'my test value'
        );
      });

      it('should not error value to the console when error notification receieved', () => {
        // ARRANGE
        const obs$ = throwError('my error value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.error).not.toHaveBeenCalledWith('my error value');
      });

      it('should not log value to the console when complete notification receieved', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug(config)).subscribe();

        // ASSERT
        expect(console.log).not.toHaveBeenCalledTimes(2);
        expect(console.log).not.toHaveBeenNthCalledWith(
          2,
          'I received a completion'
        );
      });
    });
  });

  describe('when a label is used', () => {
    describe('using a string param', () => {
      it('should log value to the console when next notification receieved with the label', () => {
        // ARRANGE
        const obs$ = of('my test value');

        // ACT
        obs$.pipe(debug('Test Label')).subscribe();

        // ASSERT
        expect(console.log).toHaveBeenCalledWith('Test Label', 'my test value');
      });

      it('should error value to the console when error notification receieved with the label', () => {
        // ARRANGE
        const obs$ = throwError('my error value');

        // ACT
        obs$.pipe(debug('Test Label')).subscribe();

        // ASSERT
        expect(console.error).toHaveBeenCalledWith(
          'Test Label',
          'my error value'
        );
      });
    });

    describe('using the config object', () => {
      let config: Partial<DebugOperatorConfig<string>>;

      beforeEach(
        () =>
          (config = {
            shouldIgnore: false,
            label: 'Test Label',
          })
      );

      describe('and when shouldIgnore is false', () => {
        beforeEach(() => (config.shouldIgnore = false));

        it('should log value to the console when next notification receieved', () => {
          // ARRANGE
          const obs$ = of('my test value');

          // ACT
          obs$.pipe(debug(config)).subscribe();

          // ASSERT
          expect(console.log).toHaveBeenCalledWith(
            'Test Label',
            'my test value'
          );
        });

        it('should error value to the console when error notification receieved', () => {
          // ARRANGE
          const obs$ = throwError('my error value');

          // ACT
          obs$.pipe(debug(config)).subscribe();

          // ASSERT
          expect(console.error).toHaveBeenCalledWith(
            'Test Label',
            'my error value'
          );
        });

        it('should log value to the console when complete notification receieved', () => {
          // ARRANGE
          const obs$ = of('my test value');

          // ACT
          obs$.pipe(debug(config)).subscribe();

          // ASSERT
          expect(console.log).toHaveBeenCalledTimes(2);
          expect(console.log).toHaveBeenNthCalledWith(
            2,
            'Test Label completed'
          );
        });
      });

      describe('and when shouldIgnore is true', () => {
        beforeEach(() => (config.shouldIgnore = true));

        it('should not log value to the console when next notification receieved', () => {
          // ARRANGE
          const obs$ = of('my test value');

          // ACT
          obs$.pipe(debug(config)).subscribe();

          // ASSERT
          expect(console.log).not.toHaveBeenCalledWith(
            'Test Label',
            'my test value'
          );
        });

        it('should not error value to the console when error notification receieved', () => {
          // ARRANGE
          const obs$ = throwError('my error value');

          // ACT
          obs$.pipe(debug(config)).subscribe();

          // ASSERT
          expect(console.error).not.toHaveBeenCalledWith(
            'Test Label',
            'my error value'
          );
        });

        it('should not log value to the console when complete notification receieved', () => {
          // ARRANGE
          const obs$ = of('my test value');

          // ACT
          obs$.pipe(debug(config)).subscribe();

          // ASSERT
          expect(console.log).not.toHaveBeenCalledTimes(2);
          expect(console.log).not.toHaveBeenNthCalledWith(
            2,
            'Test Label completed'
          );
        });
      });
    });
  });
});
