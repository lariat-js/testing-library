import { Screen, screen, within } from "@testing-library/react"
import { NestedCollection, set, unwrap } from "./utils.js"

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
  first: () => ReturnType<Screen[`get${T}`]>
  get: (() => ReturnType<Screen[`get${T}`]>) & {
    all: () => ReturnType<Screen[`getAll${T}`]>
    first: () => ReturnType<Screen[`query${T}`]>
    last: () => ReturnType<Screen[`query${T}`]>
    nth: (index: number) => ReturnType<Screen[`query${T}`]>
  }
  last: () => ReturnType<Screen[`get${T}`]>
  nth: (index: number) => ReturnType<Screen[`get${T}`]>
  query: (() => ReturnType<Screen[`query${T}`]>) & {
    all: () => ReturnType<Screen[`queryAll${T}`]>
    first: () => ReturnType<Screen[`query${T}`]>
    last: () => ReturnType<Screen[`query${T}`]>
    nth: (index: number) => ReturnType<Screen[`query${T}`]>
  }
}

export class Collection {
  #root?: () => HTMLElement | undefined

  protected byAltText: EnhancedQuery<"ByAltText">
  protected byLabelText: EnhancedQuery<"ByLabelText">
  protected byPlaceholderText: EnhancedQuery<"ByPlaceholderText">
  protected byRole: EnhancedQuery<"ByRole">
  protected byTestId: EnhancedQuery<"ByTestId">
  protected byText: EnhancedQuery<"ByText">
  protected byTitle: EnhancedQuery<"ByTitle">

  constructor(root?: () => HTMLElement | undefined) {
    this.#root = root
    this.byAltText = this.#enhanceQuery("ByAltText")
    this.byLabelText = this.#enhanceQuery("ByLabelText")
    this.byPlaceholderText = this.#enhanceQuery("ByPlaceholderText")
    this.byRole = this.#enhanceQuery("ByRole")
    this.byTestId = this.#enhanceQuery("ByTestId")
    this.byText = this.#enhanceQuery("ByText")
    this.byTitle = this.#enhanceQuery("ByTitle")
  }

  get #screen(): any {
    const root = this.#root?.()
    return root ? within(root) : screen
  }

  protected nest<T extends Query, U>(
    collection: new (root?: () => HTMLElement | undefined) => U,
    root?: ReturnType<EnhancedQuery<T>>,
  ): NestedCollection<U> {
    const instance = new collection(() => root?.get())
    const inst = instance as NestedCollection<U>

    inst.nth = (index: number) => new collection(() => root?.nth(index))
    inst.first = () => inst.nth(0)
    inst.last = () => inst.nth(-1)

    return inst
  }

  #enhanceQuery = <T extends Query>(query: T): EnhancedQuery<T> => {
    const withArgs = (...args: unknown[]) => {
      const enhanced: any = () => unwrap(enhanced, () => this.#screen[`get${query}`](...args))

      set(enhanced, "all", () => this.#screen[`getAll${query}`](...args))
      set(enhanced, "nth", (index: number) => enhanced.all().at(index))
      set(enhanced, "first", () => enhanced.nth(0))
      set(enhanced, "last", () => enhanced.nth(-1))

      set(enhanced, "get", () => this.#screen[`get${query}`](...args))
      set(enhanced.get, "all", () => this.#screen[`getAll${query}`](...args))
      set(enhanced.get, "nth", (index: number) => enhanced.get.all().at(index))
      set(enhanced.get, "first", () => enhanced.get.nth(0))
      set(enhanced.get, "last", () => enhanced.get.nth(-1))

      set(enhanced, "query", () => this.#screen[`query${query}`](...args))
      set(enhanced.query, "all", () => this.#screen[`queryAll${query}`](...args))
      set(enhanced.query, "nth", (index: number) => enhanced.query.all()?.at(index) ?? null)
      set(enhanced.query, "first", () => enhanced.query.nth(0))
      set(enhanced.query, "last", () => enhanced.query.nth(-1))

      set(enhanced, "find", () => this.#screen[`find${query}`](...args))
      set(enhanced.find, "all", () => this.#screen[`findAll${query}`](...args))
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
