# TSON (Token-Saving Object Notation) Summary

TSON is a compact data format designed to reduce tokens in LLM API responses.

## Syntax

- `(value)` - simple value (string, number, boolean, null)
- `name(value)` - key-value pair (object)
- `key[item1, item2]` - array (array of simple values or objects)
- `(key1(value1), key2(value2))` - object (key-value pairs)

## Naming Rules

- Root objects can be:
  - named `person(name("John"))`: Json object will be `{person: {name: "John"}}`
  - unnamed `(name("John"))`: Json object will be `{name: "John"}`
- Nested objects must have names: `person(address(street("Main")))` , Json object will be `{person: {address: {street: "Main"}}}`

- Array objects can be named or unnamed: `people[person(name("John")), (some("Value"))]`
  - json object will be `{people: [ {person: {name: "John"}} , {some: "Value"}]}`

# TSONL (TSON Line)

- Like JSONL, but with TSON syntax.
- Each line is a valid TSON value.
- Lines are separated by newlines.
