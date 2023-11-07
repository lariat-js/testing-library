import { Screen, screen } from "@testing-library/react"

type Query =
  | "ByAltText"
  | "ByLabelText"
  | "ByPlaceholderText"
  | "ByRole"
  | "ByTestId"
  | "ByText"
  | "ByTitle"

type EnhancedQuery<T extends Query> = (
  ...args: Parameters<Screen[`get${T}`]>
) => (() => ReturnType<Screen[`get${T}`]>) & {
  all: () => ReturnType<Screen[`getAll${T}`]>
  find: (() => ReturnType<Screen[`find${T}`]>) & {
    all: () => ReturnType<Screen[`findAll${T}`]>
  }
  query: (() => ReturnType<Screen[`query${T}`]>) & {
    all: () => ReturnType<Screen[`queryAll${T}`]>
  }
}

export class Collection {
  protected byAltText: EnhancedQuery<"ByAltText">
  protected byLabelText: EnhancedQuery<"ByLabelText">
  protected byPlaceholderText: EnhancedQuery<"ByPlaceholderText">
  protected byRole: EnhancedQuery<"ByRole">
  protected byTestId: EnhancedQuery<"ByTestId">
  protected byText: EnhancedQuery<"ByText">
  protected byTitle: EnhancedQuery<"ByTitle">

  constructor() {
    this.byAltText = this.#enhanceQuery("ByAltText")
    this.byLabelText = this.#enhanceQuery("ByLabelText")
    this.byPlaceholderText = this.#enhanceQuery("ByPlaceholderText")
    this.byRole = this.#enhanceQuery("ByRole")
    this.byTestId = this.#enhanceQuery("ByTestId")
    this.byText = this.#enhanceQuery("ByText")
    this.byTitle = this.#enhanceQuery("ByTitle")
  }

  #screen(fn: () => void, name: string, args: unknown[]) {
    try {
      return (screen as any)[name](...args)
    } catch (error) {
      if (error instanceof Error) {
        Error.captureStackTrace(error, fn)
      }

      throw error
    }
  }

  #enhanceQuery = <T extends Query>(query: T): EnhancedQuery<T> => {
    const withArgs = (...args: Parameters<Screen[`get${T}`]>) => {
      const enhanced: any = () => this.#screen(enhanced, `get${query}`, args)
      enhanced.all = () => this.#screen(enhanced.all, `getAll${query}`, args)

      enhanced.query = () => this.#screen(enhanced.find, `query${query}`, args)
      enhanced.query.all = () =>
        this.#screen(enhanced.query.all, `queryAll${query}`, args)

      enhanced.find = () => this.#screen(enhanced.find, `find${query}`, args)
      enhanced.find.all = () =>
        this.#screen(enhanced.find.all, `findAll${query}`, args)

      return enhanced
    }

    return withArgs as EnhancedQuery<T>
  }
}
