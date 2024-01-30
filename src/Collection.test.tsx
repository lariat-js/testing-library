/* eslint-disable vitest/no-conditional-tests, vitest/no-conditional-in-test */
import { cleanup, render } from "@testing-library/react"
import { useEffect, useState } from "react"
import { beforeEach, describe, expect, it } from "vitest"
import { Collection } from "./Collection.js"

class Page extends Collection {
  wrapper = this.byTestId("wrapper")
  name = this.byRole("textbox", { name: "Name" })
}

const page = new Page()

describe("collection", () => {
  beforeEach(() => cleanup())

  it("should support dynamic methods", () => {
    render(
      <div data-testid="wrapper">
        <input aria-label="Name" value="foo" onChange={() => {}} />
      </div>,
    )

    expect(page.wrapper()).toBeInTheDocument()
    expect(page.name()).toHaveValue("foo")
  })

  it("should support get as an alias for calling directly", () => {
    render(
      <div data-testid="wrapper">
        <input aria-label="Name" value="foo" onChange={() => {}} />
      </div>,
    )

    expect(page.wrapper.get()).toBeInTheDocument()
    expect(page.name.get()).toHaveValue("foo")
  })

  it("should support query", () => {
    render(<div data-testid="wrapper"></div>)

    expect(page.wrapper.query()).toBeInTheDocument()
    expect(page.name.query()).not.toBeInTheDocument()
  })

  it("should support find", async () => {
    function Component() {
      const [on, setOn] = useState(false)

      useEffect(() => {
        setTimeout(() => setOn(true))
      }, [])

      return (
        <div data-testid="wrapper">
          {on ? (
            <input aria-label="Name" value="foo" onChange={() => {}} />
          ) : null}
        </div>
      )
    }

    render(<Component />)
    expect(page.wrapper()).toBeInTheDocument()
    expect(page.name.query()).not.toBeInTheDocument()
    await expect(page.name.find()).resolves.toBeInTheDocument()
  })

  it("should support all", async () => {
    function Component() {
      const [on, setOn] = useState(false)

      useEffect(() => {
        setTimeout(() => setOn(true))
      }, [])

      return (
        <>
          <div data-testid="wrapper"></div>
          <div data-testid="wrapper">
            {on ? (
              <>
                <input aria-label="Name" />
                <input aria-label="Name" />
                <input aria-label="Name" />
              </>
            ) : null}
          </div>
        </>
      )
    }
    render(<Component />)

    expect(page.wrapper.all()).toHaveLength(2)
    expect(page.wrapper.query.all()).toHaveLength(2)
    expect(page.name.query.all()).toHaveLength(0)
    await expect(page.name.find.all()).resolves.toHaveLength(3)
  })

  it("should support first", async () => {
    function Component() {
      const [on, setOn] = useState(false)

      useEffect(() => {
        setTimeout(() => setOn(true))
      }, [])

      return (
        <>
          <div data-testid="wrapper" id="one"></div>
          <div data-testid="wrapper" id="two">
            {on ? (
              <>
                <input aria-label="Name" id="three" />
                <input aria-label="Name" id="four" />
                <input aria-label="Name" id="five" />
              </>
            ) : null}
          </div>
        </>
      )
    }
    render(<Component />)

    expect(page.wrapper.first()).toHaveAttribute("id", "one")
    expect(page.wrapper.query.first()).toHaveAttribute("id", "one")
    expect(page.name.query.first()).not.toBeInTheDocument()
    await expect(page.name.find.first()).resolves.toHaveAttribute("id", "three")
  })

  it("should support nth", async () => {
    function Component() {
      const [on, setOn] = useState(false)

      useEffect(() => {
        setTimeout(() => setOn(true))
      }, [])

      return (
        <>
          <div data-testid="wrapper" id="one"></div>
          <div data-testid="wrapper" id="two">
            {on ? (
              <>
                <input aria-label="Name" id="three" />
                <input aria-label="Name" id="four" />
                <input aria-label="Name" id="five" />
              </>
            ) : null}
          </div>
        </>
      )
    }
    render(<Component />)

    expect(page.wrapper.nth(0)).toHaveAttribute("id", "one")
    expect(page.wrapper.nth(1)).toHaveAttribute("id", "two")
    expect(page.wrapper.nth(-1)).toHaveAttribute("id", "two")
    expect(page.wrapper.query.nth(0)).toHaveAttribute("id", "one")
    expect(page.wrapper.query.nth(1)).toHaveAttribute("id", "two")
    expect(page.wrapper.query.nth(-1)).toHaveAttribute("id", "two")
    expect(page.name.query.nth(0)).not.toBeInTheDocument()
    expect(page.name.query.nth(1)).not.toBeInTheDocument()
    expect(page.name.query.nth(-1)).not.toBeInTheDocument()
    await expect(page.name.find.nth(0)).resolves.toHaveAttribute("id", "three")
    await expect(page.name.find.nth(1)).resolves.toHaveAttribute("id", "four")
    await expect(page.name.find.nth(-1)).resolves.toHaveAttribute("id", "five")
  })

  it("should support last", async () => {
    function Component() {
      const [on, setOn] = useState(false)

      useEffect(() => {
        setTimeout(() => setOn(true))
      }, [])

      return (
        <>
          <div data-testid="wrapper" id="one"></div>
          <div data-testid="wrapper" id="two">
            {on ? (
              <>
                <input aria-label="Name" id="three" />
                <input aria-label="Name" id="four" />
                <input aria-label="Name" id="five" />
              </>
            ) : null}
          </div>
        </>
      )
    }
    render(<Component />)

    expect(page.wrapper.last()).toHaveAttribute("id", "two")
    expect(page.wrapper.query.last()).toHaveAttribute("id", "two")
    expect(page.name.query.last()).not.toBeInTheDocument()
    await expect(page.name.find.last()).resolves.toHaveAttribute("id", "five")
  })

  it("should support dynamic methods", () => {
    class Page extends Collection {
      input = (name: string) => this.byRole("textbox", { name })
    }

    const page = new Page()
    const name = page.input("Name")
    const email = page.input("Email")

    render(
      <div>
        <input aria-label="Name" value="foo" onChange={() => {}} />
        <input aria-label="Email" value="bar" onChange={() => {}} />
      </div>,
    )

    expect(name()).toHaveValue("foo")
    expect(email()).toHaveValue("bar")
  })
})
