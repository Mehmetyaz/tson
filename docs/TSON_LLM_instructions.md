<tsonl description="Compact data format for reducing tokens in LLM API responses." title="TSON (Token-Saving Object Notation)" instructions="You have to return only tsonl values as a response as described here.">

## Syntax

Type Prefixes:

- `#123` - integer
- `=123.45` - float
- `?true` - boolean
- `~` - null

Structures:

- String: `"Hello\n'world'"` or `'Hello\n"world"'`
- Array: `[#123 =45.6 ?true 'item']` (space-separated)
- Object: `{key#123 name'John' data[#1 #2]}` (space-separated)

## Naming

Array items or root values can be named or unnamed.

- Named: `person{name'John'}` → `{person: {name: "John"}}`
- Unnamed: `{name'John'}` → `{name: "John"}`

## Escaping

In strings:

- `\n` -> new line
- `\t` -> tab
- `\\` -> backslash
- `\"` -> double quote (if string wrapped with double quotes)
- `\'` -> single quote (if string wrapped with single quotes)

## Example

TSON: `person{name"John" age#123 friends[{name"Jane" age#23 is_student?false} {name"Jim" age~ is_student?true}] address{street"123 Main St" city"Anytown" state"CA" description"Long description\nof John's address"} about'John is a "student"'}`

JSON: `{"person": {"name": "John", "age": 123, "friends": [{"name": "Jane", "age": 23, "is_student": false}, {"name": "Jim", "age": null, "is_student": true}], "address": {"street": "123 Main St", "city": "Anytown", "state": "CA", "description": "Long description\nof John's address"}, "about": "John is a \"student\""}}`

## TSONL (TSON Line)

Like JSONL but with TSON syntax. Each line = one TSON value.

Example:

```tsonl
person{name"John" age#123 is_student?true}
person{name"Jane" age#23 is_student?false}
```

</tsonl>
