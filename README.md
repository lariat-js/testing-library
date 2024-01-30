# Lariat for Testing Library

[![Build status](https://github.com/lariat-js/testing-library/workflows/Build/badge.svg)](https://github.com/lariat-js/testing-library/actions)
[![npm version](https://img.shields.io/npm/v/@lariat/testing-library)](https://www.npmjs.com/package/@lariat/testing-library)

Page object framework for [Testing Library](https://testing-library.com).

## Installation

npm

```bash
npm install @lariat/testing-library
```

Yarn

```bash
yarn add @lariat/testing-library
```

pnpm

```bash
pnpm add @lariat/testing-library
```

Bun

```bash
bun add @lariat/testing-library
```

## Why?

When writing tests with Testing Library, a common problem with large components
that require a large number of tests is duplicating selectors or query
functions. Assigning to constants can help, but still doesn't fully solve the
problem. Lariat provides an extremely simple way to create page objects with
rich methods to query your elements in your tests.

## Usage

```javascript
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

You can also use the `.get()` method as an alias for calling the method
directly. This helps with readability when using dynamic methods which are
described later.

```javascript
page.input.get()
page.button("name").get()
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

## `first`, `last`, and `nth`

In cases where there are multiple similar items on the page, you may need to get
an item by it's index on the page. You can use the `.first()`, `.last()`, and
`.nth()` methods to accomplish this.

```ts
class TodoPage extends Collection {
  input = this.byRole("listitem")
}

const page = new TodoPage()
const firstItem = page.item.first()
const secondItem = page.item.nth(1)
const lastItem = page.item.last()
```

## Nested collections

So far, we've shown examples of simple collections, but Lariat also gives you
the ability to nest collections inside each other. With this approach, you can
create a page object structure that more closely resembles your page layout.

To nest a collection, use the `Collection.nest()` method and pass the nested
collection class and the root of the nested collection.

```ts
class TextField extends Collection {
  input = this.byRole("textbox")
}

class LoginPage extends Collection {
  email = this.nest(TextField, this.byTestId("email"))
  password = this.nest(TextField, this.byTestId("password"))
}

const page = new TodoPage()

page.email.input()
page.password.input.query()
```

If your nested collection is used merely to group a set of related elements
together, you can omit the second argument to use the parent collection's root.

```ts
class Header extends Collection {
  logo = this.byTestId("logo")
  title = this.byTestId("title")
}

class LoginPage extends Collection {
  header = this.nest(Header)
}

page.header.logo()
page.header.title.query()
```

### `first`, `last`, and `nth`

In some cases, you may have a nested collection where multiple instances exist
on the page. For example, a todo list may contain multiple todo items each of
which are represented as a collection. To make these scenarios easier, Lariat
provides `first`, `last`, and `nth` methods which will return a new instance of
the nested collection scoped to that specific item.

```ts
class TodoPage extends Collection {
  field = this.nest(TextField, this.byTestId("field"))
}

const page = new TodoPage()
const firstField = page.field.first()
const secondField = page.field.nth(1)
const lastField = page.field.last()
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
