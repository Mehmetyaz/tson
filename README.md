# TSON (Token-Saving Object Notation)

---

## This is a newly created project. Not ready for production use.

TSON is a compact, human-readable data format designed for token-efficient, easy-to-parse data representation. Main reason to create this format is to reduce the number of tokens in the response of the LLM APIs. It is not recommend to use this format for data storage/exchange, but still it is suitable.

## Core Syntax

TSON uses function calling syntax:

- `functionName(param1, param2)` represents an object with name
- `[]` is an array with directly included values
- Strings must be written with double quotes: `"value"`
- `-` represents undefined
- `null` represents null value
- If a string value should be "null", use quotes: `"null"`

## Object and Array Naming Rules

### Root Level Objects

- Root level objects can have names: `person(name("John"), age(30))`
  - If a name is provided, it indicates the object's type to the client and it will used for type inference
  - If no name is provided `(name("John"), age(30))`, it behaves like a standard JSON object

### Nested Objects

- Objects inside other objects:
  - Must have a name: `person(address(street("Main St"), city("Anytown")))`
  - The name represents the field name in the parent object
  - Objects without names inside other objects will cause an error

### Objects in Arrays

- Objects in arrays:
  - Names are optional: `people[person(name("John")), person(name("Jane"))]`
  - If name is provided, it indicates the object's type to the client
  - If no name is provided, it behaves like a standard JSON object

### Root Level Arrays

- Root level arrays can be named or unnamed:
  - Named array: `colors["red", "green", "blue"]`
  - Unnamed array: `["red", "green", "blue"]`
  - Named arrays indicate the type of the array to the client

## JSON Conversion

When converting TSON to JSON, special handling is needed for named objects and arrays:

### Named Object Conversion

If the object has a name and it is a root level object or an array item, it will be converted to `{name: object}` format in JSON:

- TSON: `person(name("John"), age(30))`
- JSON: `{person: {name: "John", age: 30}}`

- TSON: (in root) `arr[person(name("John"), age(30))`
- JSON: `{arr: [{person: {name: "John", age: 30}}]}`

If the root object or array item has no name, it will be converted to a standard JSON object:

- TSON: `(name("John"), age(30))`
- JSON: `{"name": "John", "age": 30}`

- TSON: (in root) `[person(name("John"), age(30))]`
- JSON: `[{"name": "John", "age": 30}]`

### Named Array Conversion

- Named arrays are also converted to `{name: array}` format:
  - TSON: `colors["red", "green", "blue"]`
  - JSON: `{colors: ["red", "green", "blue"]}`

### Named Objects in Arrays

- Objects with names inside arrays follow the same pattern:
  - TSON: `[person(name("John")), person(name("Jane"))]`
  - JSON: `[{"person": {"name": "John"}}, {"person": {"name": "Jane"}}]`

## Strings

TSON has specific string representation rules:

- All strings must be enclosed in double quotes: `name("John Doe")`
- Strings with special characters will be properly escaped: `name("John, Doe")`
- Special characters in strings are escaped with backslashes: `"\n"`, `"\t"`, `"\""`, etc.

## Formatting

- Data can be written in a single line: `user(name("John"), age(30))`
- Data can also be formatted across multiple lines for readability:

```tson
user(
  name("John"),
  age(30)
)
```

## Arrays

```tson
// Basic array
colors["red", "green", "blue"]
{colors: ["red", "green", "blue"]}

// Unnamed root array
["red", "green", "blue"]
["red", "green", "blue"]

// Array of objects
users[
  user(id(1), name("John")),
  user(id(2), name("Jane"))
]
{users: [{user: {id: 1, name: "John"}}, {user: {id: 2, name: "Jane"}}]}

// Array with unnamed objects
users[
  (id(1), name("John")),
  (id(2), name("Jane"))
]
{users: [{id: 1, name: "John"}, {id: 2, name: "Jane"}]}
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
  name("John Doe"),
  email("john.doe@example.com"),
  age(30),
  isActive(true),
  address(
    street("123 Main St"),
    city("Anytown"),
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
  firstName("John"),
  lastName("Doe"),
  age(30)
)
```

### Root Level Array Examples

```tson
// Named root array
colors["red", "green", "blue"]

// Unnamed root array
[1, 2, 3, 4, 5]

// Root array with mixed object types
[
  user(name("John"), age(30)),
  (name("Anonymous"), type("guest")),
  product(id(123), price(99.99))
]
```

### Complex Example

```tson
order(
  id("ORD-12345"),
  customer(
    id("CUST-789"),
    name("John Doe"),
    email("john@example.com")
  ),
  orderDate("2023-06-15T10:30:00Z"),
  status("shipped"),
  items[
    (
      id("ITEM-001"),
      name("Wireless Headphones"),
      quantity(1),
      price(99.99),
      notes("These are noise-cancelling headphones")
    ),
    (
      id("ITEM-002"),
      name("Phone Case"),
      quantity(2),
      price(19.99)
    ),
    (
      id("ITEM-003"),
      name("USB-C Cable"),
      quantity(3),
      price(9.99),
      notes(null)
    )
  ],
  shippingAddress(
    street("123 Main St"),
    city("Anytown"),
    state("CA"),
    zipCode(12345)
  ),
  notes("This is a gift order. Please wrap items separately and include gift message.")
)
```
