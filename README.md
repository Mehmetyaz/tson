# TSON (Token-Saving Object Notation)

TSON is a compact, human-readable data format designed for token-efficient, easy-to-parse data representation.

## Core Syntax

TSON uses function calling syntax:

- `functionName(param1, param2)` represents an object with name
- `[]` is an array with directly included values
- Strings can be written without quotes for simple cases
- String values can optionally use quotes: `"value"`
- `-` represents undefined
- `null` represents null value
- If a string value should be "null", use quotes: `"null"`

## Object and Array Naming Rules

### Root Level Objects

- Root level objects can have names: `person(name(John), age(30))`
  - If a name is provided, it indicates the object's type to the client
  - If no name is provided `(name(John), age(30))`, it behaves like a standard JSON object

### Nested Objects

- Objects inside other objects:
  - Must have a name: `person(address(street(Main St), city(Anytown)))`
  - The name represents the field name in the parent object
  - Objects without names inside other objects will cause an error

### Objects in Arrays

- Objects in arrays without schema:

  - Names are optional: `people[person(name(John)), person(name(Jane))]`
  - If name is provided, it indicates the object's type to the client
  - If no name is provided, it behaves like a standard JSON object

- Objects in arrays with schema:
  - Must follow the schema structure
  - In tuple notation with schema, names should not be provided: `(John, 30)` not `name(John), age(30)`
  - Providing names in schema-based tuples will cause an error

### Root Level Arrays

- Root level arrays can be named or unnamed:
  - Named array: `colors[red, green, blue]`
  - Unnamed array: `[red, green, blue]`
  - Named arrays indicate the type of the array to the client

## Strings

TSON has flexible string representation options:

- Simple strings can be written without quotes: `name(John Doe)`
- Strings with special characters should use quotes: `name("John, Doe")`
- For multi-line strings, use curly braces: `description({This is a 
multi-line string that
can span several lines})`
- Multi-line strings are only allowed within `{}` - any other multi-line strings will cause parsing errors
- Strings without `{}` must be on a single line

## Formatting

- Data can be written in a single line: `user(name(John), age(30))`
- Data can also be formatted across multiple lines for readability:

```tson
user(
  name(John),
  age(30)
)
```

## Schema Definition

- `@` is used for inline schema: `@person(name(string), age(number))`
- `...` is used for repeatable schema
- `?` is used for optional fields: `middleName(string?)`
- Union types can be defined using `|`: `status(active|inactive|pending)`
- Schema definitions can include arrays: `tags[string]`

## Arrays

```tson
// Basic array
colors[red, green, blue]

// Unnamed root array
[red, green, blue]

// Array of objects
users[
  user(id(1), name(John)),
  user(id(2), name(Jane))
]

// Array with unnamed objects
users[
  (id(1), name(John)),
  (id(2), name(Jane))
]

// Using schema for arrays
items[...@item(id(string), name(string))[
  (item1, "First Item"),
  (item2, "Second Item")
]]
```

## Comments

TSON supports comments for documentation:

```tson
// This is a single line comment

/*
  This is a multi-line
  comment block
*/

user(
  name(John), // Inline comment
  age(30)
)
```

## Object Names

- Object names must follow JavaScript variable naming conventions
- Valid: `userName`, `user_name`, `user123`, `$user`
- Invalid: `user-name`, `123user`
- Object names cannot contain `@` character

## Examples

### Basic Example

```tson
user(
  name(John Doe),
  email(john.doe@example.com),
  age(30),
  isActive(true),
  address(
    street(123 Main St),
    city(Anytown),
    zipCode(12345)
  ),
  phoneNumbers[
    "+1-555-123-4567",
    "+1-555-987-6543"
  ]
)
```

### Root Level Unnamed Object

```tson
(
  firstName(John),
  lastName(Doe),
  age(30)
)
```

### Root Level Array Examples

```tson
// Named root array
colors[red, green, blue]

// Unnamed root array
[1, 2, 3, 4, 5]

// Root array with mixed object types
[
  user(name(John), age(30)),
  (name(Anonymous), type(guest)),
  product(id(123), price(99.99))
]
```

### Schema Example

```tson
people[...@person(name(string), age(number), gender(male|female|other))[
  (John Doe, 30, male),
  (Jane Smith, 25, female),
  (Alex Johnson, 35, other)
]]
```

### Complex Example with Optional Fields

```tson
order(
  id(ORD-12345),
  customer(
    id(CUST-789),
    name(John Doe),
    email(john@example.com)
  ),
  orderDate(2023-06-15T10:30:00Z),
  status(processing|shipped|delivered)(shipped),
  items[...@item(id(string), name(string), quantity(number), price(number), notes(string?))[
    (ITEM-001, "Wireless Headphones", 1, 99.99, {These are
      noise-cancelling
      headphones}),
    (ITEM-002, "Phone Case", 2, 19.99, -),
    (ITEM-003, "USB-C Cable", 3, 9.99, null)
  ]],
  shippingAddress(
    street(123 Main St),
    city(Anytown),
    state(CA),
    zipCode(12345)
  ),
  // This field is for special handling instructions
  notes({This is a gift order.
Please wrap items separately and include gift message.})
)
```
