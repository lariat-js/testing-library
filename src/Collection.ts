import { Screen, screen } from "@testing-library/react"
import { set, unwrap } from "./utils.js"

type Query =
  | "ByAltText"
  | "ByLabelText"
  | "ByPlaceholderText"
  | "ByRole"
  | "ByTestId"
  | "ByText"
  | "ByTitle"

type EnhancedQuery<T extends Query> = (...args: Parameters<Screen[`get${T}`]>) => (() => ReturnType<
  Screen[`get${T}`]
>) & {
  all: () => ReturnType<Screen[`getAll${T}`]>
  find: (() => ReturnType<Screen[`find${T}`]>) & {
    all: () => ReturnType<Screen[`findAll${T}`]>
    first: () => ReturnType<Screen[`query${T}`]>
    last: () => ReturnType<Screen[`query${T}`]>
    nth: (index: number) => ReturnType<Screen[`query${T}`]>
  }
  first: () => ReturnType<Screen[`query${T}`]>
  get: (() => ReturnType<Screen[`get${T}`]>) & {
    all: () => ReturnType<Screen[`getAll${T}`]>
    first: () => ReturnType<Screen[`query${T}`]>
    last: () => ReturnType<Screen[`query${T}`]>
    nth: (index: number) => ReturnType<Screen[`query${T}`]>
  }
  last: () => ReturnType<Screen[`query${T}`]>
  nth: (index: number) => ReturnType<Screen[`query${T}`]>
  query: (() => ReturnType<Screen[`query${T}`]>) & {
    all: () => ReturnType<Screen[`queryAll${T}`]>
    first: () => ReturnType<Screen[`query${T}`]>
    last: () => ReturnType<Screen[`query${T}`]>
    nth: (index: number) => ReturnType<Screen[`query${T}`]>
  }
}

const s = screen as any

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

  #enhanceQuery = <T extends Query>(query: T): EnhancedQuery<T> => {
    const withArgs = (...args: unknown[]) => {
      const enhanced: any = () => unwrap(enhanced, () => s[`get${query}`](...args))

      set(enhanced, "all", () => s[`getAll${query}`](...args))
      set(enhanced, "nth", (index: number) => enhanced.all().at(index))
      set(enhanced, "first", () => enhanced.nth(0))
      set(enhanced, "last", () => enhanced.nth(-1))

      set(enhanced, "get", () => s[`get${query}`](...args))
      set(enhanced.get, "all", () => s[`getAll${query}`](...args))
      set(enhanced.get, "nth", (index: number) => enhanced.get.all().at(index))
      set(enhanced.get, "first", () => enhanced.get.nth(0))
      set(enhanced.get, "last", () => enhanced.get.nth(-1))

      set(enhanced, "query", () => s[`query${query}`](...args))
      set(enhanced.query, "all", () => s[`queryAll${query}`](...args))
      set(enhanced.query, "nth", (index: number) => enhanced.query.all()?.at(index) ?? null)
      set(enhanced.query, "first", () => enhanced.query.nth(0))
      set(enhanced.query, "last", () => enhanced.query.nth(-1))

      set(enhanced, "find", () => s[`find${query}`](...args))
      set(enhanced.find, "all", () => s[`findAll${query}`](...args))
      set(enhanced.find, "nth", (index: number) =>
        enhanced.find.all().then((res: unknown[]) => res.at(index)),
      )
      set(enhanced.find, "first", () => enhanced.find.nth(0))
      set(enhanced.find, "last", () => enhanced.find.nth(-1))

      return enhanced
    }

    return withArgs as EnhancedQuery<T>
  }
}
