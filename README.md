# Lariat for React Testing Library

Page object framework for
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro).

## Installation

npm

```bash
npm install @lariat/rtl
```

Yarn

```bash
yarn add @lariat/rtl
```

pnpm

```bash
pnpm add @lariat/rtl
```

Bun

```bash
bun add @lariat/rtl
```

## Why?

When writing tests with React Testing Library, a common problem with large
components that require a large number of tests is duplicating selectors or
query functions. Assigning to constants can help, but still doesn't fully solve
the problem. Lariat provides an extremely simple way to create page objects with
rich methods to query your elements in your tests.

## Usage

```javascript
import { Collection } from "@lariat/rtl"

class TodoPage extends Collection {
  wrapper = this.byTestId("wrapper")
  input = this.byLabelText("Email")
}

it("should work", () => {
  const page = new TodoPage()
  expect(page.wrapper.query()).toBeInTheDocument()
  expect(page.input()).toHaveValue("mark@example.com")
})
```

## Working with methods

When creating methods in Lariat collections, you do not specify the method of
querying the DOM node, merely the selector information. This allows you to later
decide how to get the node.

By default, if you call the method, it will call the appropriate `getBy*` method
under the hood.

```javascript
page.input()
```

If you want to use the `queryBy*` method (useful for testing element's do not
exist), you can use `.query()`.

```javascript
page.input.query()
```

The same applies to the `findBy*` methods which can be called using `.find()`.

```javascript
await page.input.find()
```

Each of these supports a `.all()` method to get a list of nodes instead of a
single node.

```javascript
page.input.all()
page.input.query.all()
await page.input.find.all()
```

## Dynamic methods

Because `Collection` is an ordinary JavaScript class, you can create dynamic
page object methods by defining class methods in your collection.

```javascript
class TodoPage extends Collection {
  input = (name) => this.byRole("input", { name })
}

const page = new TodoPage()
const name = page.input("Name")
const email = page.input("Email")
```
