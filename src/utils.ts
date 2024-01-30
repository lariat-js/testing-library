/** Sets a function property and automtically unwraps errors. */
export function set(obj: any, prop: string, fn: (...args: any[]) => unknown) {
  obj[prop] = (...args: unknown[]) => unwrap(obj[prop], fn.bind(obj, ...args))
}

/** Unwraps errors and captures stack traces. */
export function unwrap<T>(ident: (...args: unknown[]) => unknown, fn: () => T): T {
  try {
    return fn()
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, ident)
    }

    throw error
  }
}

export type NestedCollection<T> = T & {
  first(): T
  last(): T
  nth(index: number): T
}
