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

## Performance

**Theory vs Practice**: Theoretically, TSON should parse faster than JSON since each value's type is known upfront, eliminating type detection overhead. However, in practice, we haven't achieved this theoretical speed advantage.

**JSON's Optimization Legacy**: JSON parsers have been heavily optimized over decades, making them extremely efficient. Our current TSON implementation hasn't reached that level of optimization yet.

**Priority Statement**: Performance was not the primary goal of TSON. The main objectives are:

- **Token reduction** (15-30% fewer tokens for LLM efficiency)
- **Streaming capability** (progressive parsing for real-time applications)
- **Readability** (human-friendly format)

**Current Status**: No comprehensive performance optimization or code quality review has been conducted yet. The current implementations prioritize correctness and feature completeness over speed.

**Future Work**: Performance improvements and code quality enhancements are planned for future releases once the format stabilizes and core functionality is complete across all target languages.

## Documentation

📖 **For complete documentation, examples, and detailed syntax rules, see [TSON.md](docs/TSON.md)**

🎯 **For real-world use cases and practical examples, see [Real-World Scenarios](docs/scenarios.md)**

## Using TSON with LLMs

To use TSON in your LLM prompts, include the instructions from [TSON_LLM_instructions.md](docs/TSON_LLM_instructions.md) in your system prompt or user prompt. This file contains concise instructions that teach the LLM how to format responses in TSON.

Example prompt addition:

```
Please format your response using TSON syntax as described in the attached instructions.
```

## TSON Real-World Scenarios

This document demonstrates practical use cases where TSON provides significant advantages over traditional JSON/JSONL formats, particularly in streaming applications and token-sensitive environments.

### Scenarios

Each scenario compares three approaches:

1. **Structured Output** - Traditional single JSON response
2. **JSONL with {field: value}** - Streaming with wrapper objects
3. **TSONL** - Streaming with named root values

#### [Multi-Part Content Generation](docs/scenario-content-generation.md)

AI system generating educational content with multiple content types (text, pictures, audio, metadata).

##### Comparison

| Approach             | Tokens | Streaming |
| -------------------- | ------ | --------- |
| Structured Output    | 121    | ❌ No     |
| JSONL {field: value} | 131    | ✅ Yes    |
| TSONL                | 77     | ✅ Yes    |

#### [Streaming Translation Service](docs/scenario-streaming-translation.md)

Large document translation with progressive delivery to users.

##### Comparison

| Approach             | Tokens | Streaming |
| -------------------- | ------ | --------- |
| Structured Output    | 77     | ❌ No     |
| JSONL {field: value} | 108    | ✅ Yes    |
| TSONL                | 54     | ✅ Yes    |

#### [Dictionary Entry Generation](docs/scenario-dictionary-entry.md)

Creating structured dictionary entries with metadata, explanations, and examples.

##### Comparison

| Approach              | Tokens | Streaming |
| --------------------- | ------ | --------- |
| Structured Output     | 99     | ❌ No     |
| JSONL {type: payload} | 110    | ✅ Yes    |
| TSONL                 | 66     | ✅ Yes    |

## Implementation Packages

Implementation packages are available in the [`/packages`](packages/) directory:

- **[tson-js](packages/tson-js/)** - JavaScript/TypeScript implementation ✅ **Complete**
  - Full parser and serializer
  - TypeScript definitions
  - Comprehensive test suite
  - Production ready
- **[tson-rust](packages/tson-rust/)** - Rust implementation 🚧 **In Progress**
- **[tson-dart](packages/tson-dart/)** - Dart implementation 🚧 **In Progress**

Each complete package includes:

- Parser and serializer
- Type definitions
- Test suites
- Usage examples
- Documentation

## Tools

- **[tson-vscode](extensions/tson-vscode/)** - VSCode extension for TSON and TSONL ✅ **Developing - Not Published Yet**
  - Syntax highlighting
  - Language support
  - File icons
- **tson-jetbrains** - JetBrains plugin for TSON and TSONL 📋 **Planned**

## Contributing

This is an experimental format and **contributions are needed in almost every area!** We welcome:

### 🌍 **Language Implementations**

Beyond our current JavaScript, Rust, and Dart implementations:

- **Python** (next on the list)
- **Go**, **Ruby**, **PHP**, etc.
- Any language you're passionate about! Especially languages that are used in backend.

### ⚙️ **Parser & Serializer Enhancements**

- **Parse options**: Validation modes, streaming parsers
- **Stringify options**: Formatting styles, compression
- **Performance optimizations**: Faster parsing algorithms, memory efficiency
- **Error handling**: Better error messages, recovery mechanisms

### 🎨 **Syntax & Format Evolution**

- **Syntax improvements**: More intuitive operators, cleaner edge cases
- **Compatibility modes**: JSON fallback, migration tools

### 🛠 **Tools & Extensions**

- **IDE Plugins**: IntelliJ, Sublime, Atom, Vim, Emacs
- **Command-line tools**: Validators, converters, formatters, linters
- **Online tools**: Interactive playground, converter websites

### 📚 **Documentation & Examples**

- **Real-world use cases**: API responses, config formats, data exchange
- **Educational content**: Tutorials, best practices, migration guides
- **Language-specific guides**: Integration examples for each platform

### 🧪 **Testing & Quality**

- **Comprehensive test suites**: Edge cases, performance benchmarks
- **Fuzzing**: Random input testing, stress testing
- **Cross-platform compatibility**: Ensure consistency across implementations

### 🚀 **Advanced Features**

- **Streaming parsers**: For LLM delta streams, large datasets
- **WASM compilation**: Browser-ready high-performance parsers

**See our [contributing guidelines](CONTRIBUTING.md) for detailed information on how to get started!**

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

## Support

If you find TSON useful, you can support the project:

<a href="https://www.buymeacoffee.com/mehmetyaz" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a computer part&emoji=🔩&slug=mehmetyaz&button_colour=40DCA5&font_colour=ffffff&font_family=Inter& outline_colour=000000&coffee_colour=FFDD00" alt="Buy me a computer part"></a>

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
