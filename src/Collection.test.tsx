import { describe, it, expect, beforeEach } from "vitest"
import { Collection } from "./Collection.js"
import { cleanup, render } from "@testing-library/react"
import { useState, useEffect } from "react"

class Page extends Collection {
  wrapper = this.byTestId("wrapper")
  name = this.byRole("textbox", { name: "Name" })
}

const page = new Page()

describe("Collection", () => {
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
    expect(await page.name.find()).toBeInTheDocument()
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
    expect(await page.name.find.all()).toHaveLength(3)
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
