# TSON (Token-Saving Object Notation)

---

## This is a newly created project. Not ready for production use.

TSON is a compact, human-readable data format designed for token-efficient, easy-to-parse data representation. Main reason to create this format is to reduce the number of tokens in the response of the LLM APIs. It is not recommend to use this format for data storage/exchange, but still it is suitable.

## Core Syntax

TSON uses a simple, concise syntax:

- `name{prop1, prop2}` represents an object with name
- `name[item1, item2]` represents an array with name
- `name"value"` represents a string
- `name=true|false` represents a boolean
- `name#123` represents an integer
- `name&123.45` represents a float/double
- `name` represents a null value
- `-` represents undefined

## Object and Array Naming Rules

### Root Level Objects

- Root level objects can have names: `person{name"John", age#30}`
  - If a name is provided, it indicates the object's type to the client and it will used for type inference
  - If no name is provided `{name"John", age#30}`, it behaves like a standard JSON object

### Nested Objects

- Objects inside other objects:
  - Must have a name: `person{address{street"Main St", city"Anytown"}}`
  - The name represents the field name in the parent object
  - Objects without names inside other objects will cause an error

### Objects in Arrays

- Objects in arrays:
  - Names are optional: `people[person{name"John"}, person{name"Jane"}]`
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

- TSON: `person{name"John", age#30}`
- JSON: `{person: {name: "John", age: 30}}`

- TSON: (in root) `arr[person{name"John", age#30}]`
- JSON: `{arr: [{person: {name: "John", age: 30}}]}`

If the root object or array item has no name, it will be converted to a standard JSON object:

- TSON: `{name"John", age#30}`
- JSON: `{"name": "John", "age": 30}`

- TSON: (in root) `[person{name"John", age#30}]`
- JSON: `[{"name": "John", "age": 30}]`

### Named Array Conversion

- Named arrays are also converted to `{name: array}` format:
  - TSON: `colors["red", "green", "blue"]`
  - JSON: `{colors: ["red", "green", "blue"]}`

### Named Objects in Arrays

- Objects with names inside arrays follow the same pattern:
  - TSON: `[person{name"John"}, person{name"Jane"}]`
  - JSON: `[{"person": {"name": "John"}}, {"person": {"name": "Jane"}}]`

## Strings

TSON has specific string representation rules:

- All strings are defined as: `name"John Doe"`
- Strings with special characters will be properly escaped: `name"John, Doe"`
- Special characters in strings are escaped with backslashes: `"\n"`, `"\t"`, `"\""`, etc.

## Formatting

- Data can be written in a single line: `user{name"John", age#30}`
- Data can also be formatted across multiple lines for readability:

```tson
user{
  name"John",
  age#30
}
```

## Arrays

```tson
// Basic array
colors["red", "green", "blue"]
{colors: ["red", "green", "blue"]}

// Unnamed root array
["red", "green", "blue"]
["red", "green", "blue"]

// Arrays with direct value types
[#1, #2, #3, #4, #5]  // Integers with # prefix
[&1.1, &2.2, &3.3]    // Floats with & prefix
[=true, =false]       // Booleans with = prefix

// Type-specified arrays (provides hint for consumers but doesn't enforce type)
numbers<#>[1, 2, 3, 4, 5]  // Integer array
prices<&>[10.99, 5.99, 19.99]  // Float array
flags<=>[true, false, true]  // Boolean array

// Unnamed typed arrays
<#>[1, 2, 3]  // Unnamed integer array
<&>[1.1, 2.2]  // Unnamed float array
<=>[true, false]  // Unnamed boolean array

// Nested typed arrays
[<#>[1, 2], <&>[3.3, 4.4]]  // Array containing typed arrays

// Type specifier doesn't override explicit type markers
mixed<#>[1, 2, &3.5]  // Contains integers 1, 2 and float 3.5

// Array of objects
users[
  user{id#1, name"John"},
  user{id#2, name"Jane"}
]
{users: [{user: {id: 1, name: "John"}}, {user: {id: 2, name: "Jane"}}]}

// Array with unnamed objects
users[
  {id#1, name"John"},
  {id#2, name"Jane"}
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
user{
  name"John Doe",
  email"john.doe@example.com",
  age#30,
  isActive=true,
  address{
    street"123 Main St",
    city"Anytown",
    zipCode#12345
  },
  phoneNumbers[
    "+1-555-123-4567",
    "+1-555-987-6543"
  ]
}
```

### Root Level Unnamed Object

```tson
{
  firstName"John",
  lastName"Doe",
  age#30
}
```

### Root Level Array Examples

```tson
// Named root array
colors["red", "green", "blue"]

// Unnamed root array
[1, 2, 3, 4, 5]

// Root array with mixed object types
[
  user{name"John", age#30},
  {name"Anonymous", type"guest"},
  product{id#123, price&99.99}
]
```

### Complex Example

```tson
order{
  id"ORD-12345",
  customer{
    id"CUST-789",
    name"John Doe",
    email"john@example.com"
  },
  orderDate"2023-06-15T10:30:00Z",
  status"shipped",
  items[
    {
      id"ITEM-001",
      name"Wireless Headphones",
      quantity#1,
      price&99.99,
      notes"These are noise-cancelling headphones"
    },
    {
      id"ITEM-002",
      name"Phone Case",
      quantity#2,
      price&19.99
    },
    {
      id"ITEM-003",
      name"USB-C Cable",
      quantity#3,
      price&9.99,
      notes
    }
  ],
  shippingAddress{
    street"123 Main St",
    city"Anytown",
    state"CA",
    zipCode#12345
  },
  notes"This is a gift order. Please wrap items separately and include gift message."
}
```

## Type Specifiers

TSON supports explicit type specifiers for values:

- `#` for integers: `age#42`
- `?` for booleans: `enabled?true`
- `=` for floating-point numbers: `price=99.99`

These specifiers can also be used with arrays to indicate the element type:

```
<#>[1, 2, 3]        // Integer array
<?>[true, false]    // Boolean array
<=>["1.5", "2.5"]   // Float/string array (type specifier is just a hint)
```
