export interface DebugLogger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
  debug?: (...args: unknown[]) => void;
  info?: (...args: unknown[]) => void;
}

export const defaultLogger: DebugLogger = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.debug,
  info: console.info,
};
