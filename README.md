# TSON (Token-Saving Object Notation)

> ⚠️ **EXPERIMENTAL PROJECT** - This is a newly created project. Not ready for production use.

## TL;DR

**What**: A compact alternative to JSON/JSONL for LLM responses that reduces tokens by 15-30%  
**Why**: Enables streaming of structured content generation without wrapper object overhead  
**How**: Removes unnecessary JSON syntax overhead by using named root values instead of wrapper objects  
**Use Case**: Complex multi-part content generation (documentation, educational materials, analysis results)

---

TSON is a compact, human-readable data format designed to reduce tokens in LLM API responses while maintaining readability and ease of parsing.

## Use Case Scenario

### The Goal

Generate complex structured content (documentation, educational materials) with **streaming capability** in a single LLM call.

### Problem #1: Structured Output Limitations

**Issue**: Can't stream partial results - users must wait for the entire response to complete.
**Attempted Solution**: Use partial JSON parsers.
**Result**: Partial JSON parsing didn't solve the streaming problem effectively (at least for me).

### Problem #2: JSONL Token Overhead

**Issue**: Traditional JSONL requires wrapper structures for each content type.

**Standard JSONL** (type-payload structure) - **58 tokens**:

```jsonl
{"type": "metadata", "payload": {"difficulty": 3, "duration": 45}}
{"type": "text", "payload": "<h1>Title</h1>"}
{"type": "audio", "payload": "<voice>Content</voice>"}
```

### Solution #1: Simplified JSONL Structure

**Approach**: Remove "type" and "payload" wrappers, use `{type: content}` directly.

**Optimized JSONL** - **40 tokens**:

```jsonl
{"metadata": {"difficulty": 3, "duration": 45}}
{"text": "<h1>Title</h1>"}
{"audio": "<voice>Content</voice>"}
```

### Problem #3: Still Too Verbose

**Issue**: Even optimized JSONL has unnecessary JSON syntax overhead.
**Need**: Maximum token efficiency while maintaining type safety and streaming capability.

### Final Solution: TSONL

**Approach**: Named root values eliminate all wrapper overhead and remove all unnecessary JSON syntax overhead.

**TSONL** - **28 tokens** (15-30% reduction):

```tsonl
metadata{difficulty#3 duration#45}
text'<h1>Title</h1>'
audio'<voice>Content</voice>'
```

## Why TSONL

- **Progressive streaming**: Each line processes independently as it arrives
- **15-30% fewer tokens**: No wrapper objects or redundant field names
- **Type safety**: Named root values provide clear typing without overhead
- **Easy parsing**: Simple line-by-line processing
- **Clean separation**: Each content type is independently structured

Perfect for AI systems generating complex, multi-part structured content where both streaming capability and token efficiency are crucial.

## Quick Format Overview

TSON uses simple, concise syntax with type prefixes and space separation:

- **Type prefixes**: `#123` (int), `=123.45` (float), `?true` (bool), `~` (null)
- **Strings**: `"text"` or `'text'` (choose based on content to avoid escaping)
- **Arrays**: `[#1 #2 "text"]` (space-separated)
- **Objects**: `{name"John" age#30 active?true}` (space-separated)

**Example:** (34 tokens)

```tson
user{
  name"John"
  age#30
  friends[
    name"Jane"
    name"Bob"
  ]
  active?true
}
```

**Equivalent JSON:** (50 tokens)

```json
{
  "user": {
    "name": "John",
    "age": 30,
    "friends": [{ "name": "Jane" }, { "name": "Bob" }],
    "active": true
  }
}
```

### TSONL (TSON Lines)

Like JSONL, TSONL processes one TSON value per line, perfect for:

- Streaming data processing
- Batch operations
- Log file formats

```tsonl
user{name"John" age#30}
user{name"Jane" age#25}
user{name"Bob" age#35}
```

**Equivalent JSONL:**

```jsonl
{"user": {"name": "John", "age": 30}}
{"user": {"name": "Jane", "age": 25}}
{"user": {"name": "Bob", "age": 35}}
```

### Token Efficiency

TSON typically reduces token count by 15-30% compared to equivalent JSON:

- Eliminates colons, commas, and excessive quotes
- Shorter type indicators
- Space-based separation
- Smart quote selection reduces escaping

## Documentation

📖 **For complete documentation, examples, and detailed syntax rules, see [TSON.md](docs/TSON.md)**

## Using TSON with LLMs

To use TSON in your LLM prompts, include the instructions from [TSON_LLM_instructions.md](docs/TSON_LLM_instructions.md) in your system prompt or user prompt. This file contains concise instructions that teach the LLM how to format responses in TSON.

Example prompt addition:

```
Please format your response using TSON syntax as described in the attached instructions.
```

## Implementation Packages

Implementation packages are available in the [`/packages`](packages/) directory:

- **[tson-js](packages/tson-js/)** - JavaScript/TypeScript implementation. Completed for testing purposes.
- **[tson-rust](packages/tson-rust/)** - Rust implementation. Started, not implemented yet.
- **[tson-dart](packages/tson-dart/)** - Dart implementation. Started, not implemented yet.

Each package will include:

- Parser and serializer
- Type definitions
- Test suites
- Usage examples

## Tools

- [tson-vscode](extensions/tson-vscode/) - VSCode extension for TSON and TSONL.
- [tson-jetbrains](extensions/tson-jetbrains/) - JetBrains plugin for TSON and TSONL. (Not created yet)

## Contributing

This is an experimental format. Contributions, feedback, and suggestions are welcome! Please check the individual package directories for specific implementation details and contribution guidelines.

## Contributors

Thanks to all the contributors who have helped make TSON better:

<table>
<tr>
    <td align="center">
        <a href="https://github.com/Mehmetyaz">
            <img src="https://github.com/Mehmetyaz.png" width="80" style="border-radius:50%"/>
            <br />
            <sub><b>Mehmet Yaz</b></sub>
        </a>
        <br />
        <sub>Creator & Maintainer</sub>
    </td>
</tr>
</table>

Want to contribute? Check out our [contributing guidelines](CONTRIBUTING.md) and feel free to submit issues, feature requests, or pull requests!

## What's Next

- [ ] Complete JavaScript implementation (tson-js)
- [ ] Complete Dart implementation (tson-dart)
- [ ] Add Python implementation (tson-python)
- [ ] Implement stream parser for LLM delta streams (for all implementations)
- [ ] Complete Rust implementation with WASM compilation (tson-rust)
- [ ] Add more comprehensive tests (for all implementations)
- [ ] Complete VSCode extension (tson-vscode)
- [ ] Create JetBrains plugin (tson-jetbrains)
- [ ] Performance improvements
- [ ] Add more examples and use cases
- [ ] Submit RFC proposal for TSON and TSONL standardization
- [ ] Contact relevant companies to ensure LLM models recognize TSON and TSONL by default

## License

See [LICENSE](LICENSE) file for details.
