# TSON (Token-Saving Object Notation) Format Guide

TSON is a compact, human-readable data format designed to reduce tokens in LLM API responses while maintaining readability and ease of parsing.

## Core Syntax

### Type Prefixes

Native types in TSON use specific prefixes to identify their type:

- **Integers**: `#123`, `#-456`, `#0`
- **Floating-point numbers**: `=123.45`, `=-67.89`, `=0.0`
- **Booleans**: `?true`, `?false`
- **Null values**: `~`

### Strings

Strings can be wrapped with either double quotes (`"`) or single quotes (`'`):

- **Double quotes**: `"Hello, world!"`
- **Single quotes**: `'Hello, world!'`

**Quote Selection Strategy:**

- Use double quotes when the string contains single quotes: `"John's car"`
- Use single quotes when the string contains double quotes: `'He said "Hello"'`
- This avoids the need for escaping in most cases

### String Escaping

When escaping is necessary within strings:

**In double-quoted strings:**

- `\"` - double quote
- `\\` - backslash
- `\n` - newline
- `\t` - tab
- `\r` - carriage return

**In single-quoted strings:**

- `\'` - single quote
- `\\` - backslash
- `\n` - newline
- `\t` - tab
- `\r` - carriage return

**Examples:**

- `"She said \"Hello\" to me"`
- `'It\'s a beautiful day'`
- `"Line 1\nLine 2"`
- `"File path: C:\\Users\\John"`

### Arrays

Arrays are wrapped with square brackets `[]` and items are separated by spaces:

```tson
["red" "green" "blue"]
[#1 #2 #3 #4 #5]
[?true ?false ~ #42 =3.14 "mixed types"]
```

### Objects

Objects are wrapped with curly braces `{}` and key-value pairs are separated by spaces:

```tson
{name"John" age#30 active?true}
{id#123 price=99.99 description"A great product"}
```

## Naming Rules

### Object Properties

Object properties must always be named:

```tson
{name"John" age#30}  // ✓ Correct
```

### Root Values and Array Items

Root values or array items can be either named or unnamed:

**Named examples:**

- `person{name"John"}` → `{"person": {"name": "John"}}`
- `colors["red" "green" "blue"]` → `{"colors": ["red", "green", "blue"]}`
- `[person{name"John"} company{name"ACME"}]` → `[{"person": {"name": "John"}}, {"company": {"name": "ACME"}}]`

**Unnamed examples:**

- `{name"John"}` → `{"name": "John"}`
- `["red" "green" "blue"]` → `["red", "green", "blue"]`

## Practical Examples

### Basic User Object

**34 tokens in TSON**

```tson
user{
  name"John Doe"
  email"john.doe@example.com"
  age#30
  isActive?true
  lastLogin~
}
```

**Equivalent JSON:**

**49 tokens in JSON**

```json
{
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "isActive": true,
    "lastLogin": null
  }
}
```

### Complex Nested Structure

**199 tokens in TSON**

```tson
order{
  id"ORD-12345"
  customer{
    name"John Doe"
    email"john@example.com"
    preferences{
      newsletter?true
      notifications'SMS and email'
    }
  }
  items[
    {
      name"Wireless Headphones"
      price=99.99
      quantity#1
      notes'Customer requested "black color"'
    }
    {
      name"Phone Case"
      price=19.99
      quantity#2
      description"Protective case\nDrop-tested up to 10 feet"
    }
  ]
  shippingAddress{
    street"123 Main St"
    city"Anytown"
    state"CA"
    zipCode#12345
    instructions"Leave at front door\nRing doorbell twice"
  }
  metadata{
    createdAt"2023-06-15T10:30:00Z"
    source"web"
    campaign~
  }
}
```

**Equivalent JSON:**

**255 tokens in JSON**

```json
{
  "order": {
    "id": "ORD-12345",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "preferences": {
        "newsletter": true,
        "notifications": "SMS and email"
      }
    },
    "items": [
      {
        "name": "Wireless Headphones",
        "price": 99.99,
        "quantity": 1,
        "notes": "Customer requested \"black color\""
      },
      {
        "name": "Phone Case",
        "price": 19.99,
        "quantity": 2,
        "description": "Protective case\nDrop-tested up to 10 feet"
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": 12345,
      "instructions": "Leave at front door\nRing doorbell twice"
    },
    "metadata": {
      "createdAt": "2023-06-15T10:30:00Z",
      "source": "web",
      "campaign": null
    }
  }
}
```

### Array Examples

**Simple array:**

```tson
colors["red" "green" "blue"]
```

**Mixed-type array:**

```tson
data[#123 =456.78 ?true ~ "text" {key"value"}]
```

**Array with nested objects:**

```tson
users[
  {name"John" age#30 active?true}
  {name"Jane" age#25 active?false}
  {name"Bob" age#35 active?true}
]
```

### Root-level Variations

**Unnamed root object:**

```tson
{
  firstName"John"
  lastName"Doe"
  age#30
}
```

**Named root object:**

```tson
person{
  firstName"John"
  lastName"Doe"
  age#30
}
```

**Root array:**

```tson
[
  {name"Product A" price=29.99}
  {name"Product B" price=39.99}
  {name"Product C" price=49.99}
]
```

## Advanced Features

### Handling Special Characters

```tson
{
  message'He said "Hello, world!" to everyone'
  path"C:\\Users\\John\\Documents"
  multiline"Line 1\nLine 2\nLine 3"
  escaped"Quote: \"Hello\" and backslash: \\"
}
```

### Complex Nesting

```tson
application{
  config{
    database{
      host"localhost"
      port#5432
      credentials{
        username"admin"
        password"secret123"
        ssl?true
      }
    }
    features[
      {name"auth" enabled?true settings{timeout#3600}}
      {name"logging" enabled?true settings{level"info" file"/var/log/app.log"}}
      {name"cache" enabled?false settings~}
    ]
  }
  metadata{
    version"1.2.3"
    buildDate"2023-06-15"
    environment"production"
    tags["api" "backend" "nodejs"]
  }
}
```

## TSONL (TSON Line Format)

TSONL is similar to JSONL but uses TSON syntax. Each line contains a complete, valid TSON value:

```tsonl
{name"John" age#30 city"New York"}
{name"Jane" age#25 city"Los Angeles"}
{name"Bob" age#35 city"Chicago"}
user{id#123 email"test@example.com" active?true}
["item1" "item2" "item3"]
```

### TSONL Use Cases

- Streaming data
- Log file formats
- Batch processing
- Database exports
- API response chunks

## Best Practices

1. **Quote Selection**: Choose single or double quotes based on content to minimize escaping
2. **Consistent Naming**: Use consistent naming conventions for similar data structures
3. **Null Handling**: Use `~` for explicit null values rather than omitting properties
4. **Type Prefixes**: Always use appropriate type prefixes for non-string values
5. **Spacing**: Maintain consistent spacing for readability in complex structures

## Token Efficiency

TSON achieves token reduction through:

- Shorter type prefixes (`#`, `=`, `?`, `~`)
- Space separation instead of commas and colons
- Flexible quote usage to reduce escaping
- Compact syntax for common patterns

**Comparison:**

- JSON: `{"name": "John", "age": 30, "active": true}`
- TSON: `{name"John" age#30 active?true}`

The TSON version uses significantly fewer tokens while maintaining full semantic equivalence.

## Additional Examples from Real Use Cases

### E-commerce Order

```tson
order{
  id"ORD-12345"
  customer{
    id"CUST-789"
    name"John Doe"
    email"john@example.com"
  }
  orderDate"2023-06-15T10:30:00Z"
  status"shipped"
  items[
    {
      id"ITEM-001"
      name"Wireless Headphones"
      quantity#1
      price=99.99
      notes"These are noise-cancelling headphones"
    }
    {
      id"ITEM-002"
      name"Phone Case"
      quantity#2
      price=19.99
    }
    {
      id"ITEM-003"
      name"USB-C Cable"
      quantity#3
      price=9.99
      notes~
    }
  ]
  shippingAddress{
    street"123 Main St"
    city"Anytown"
    state"CA"
    zipCode#12345
  }
  notes"This is a gift order. Please wrap items separately and include gift message."
}
```

### Configuration File Example

```tson
config{
  app{
    name"MyApplication"
    version"1.2.3"
    debug?false
    port#8080
  }
  database{
    host"localhost"
    port#5432
    name"mydb"
    ssl?true
    timeout#30
  }
  logging{
    level"info"
    file"/var/log/app.log"
    maxSize=10.5
    rotate?true
  }
  features[
    "authentication"
    "logging"
    "caching"
    "monitoring"
  ]
  thresholds{
    memory=512.0
    cpu=80.5
    disk=90.0
  }
}
```

### Mixed Root Level Data

```tson
// Named root array
colors["red" "green" "blue"]

// Unnamed root array
[#1 #2 #3 #4 #5]

// Root array with mixed object types
[
  person{name"John" age#30}
  {name"Anonymous" type"guest"}
  product{id#123 price=99.99}
]
```

## Common Patterns and Tips

### Working with Quotes

1. **When to use single quotes:**

   ```tson
   {message'He said "Hello" and left'}
   ```

2. **When to use double quotes:**

   ```tson
   {message"It's a beautiful day!"}
   ```

3. **Complex mixed quotes:**
   ```tson
   {
     sql'SELECT * FROM users WHERE name = "John" AND active = 1'
     description"User's profile contains a 'status' field"
   }
   ```

### Handling Edge Cases

```tson
{
  emptyString""
  singleSpace" "
  specialChars"Tab:\t Newline:\n Quote:\" Backslash:\\"
  unicodeText"こんにちは 🌍"
  largeNumber#9223372036854775807
  precision=123.456789012345
  scientific=1.23e-4
  negative#-999
  negativeFloat=-456.78
}
```
