# Contributing to TSON

Thank you for your interest in contributing to TSON (Token-Saving Object Notation)! We welcome contributions from everyone.

## 🚧 Experimental Project Notice

TSON is currently an experimental project. The format and implementations are evolving rapidly, so please keep this in mind when contributing.

## Ways to Contribute

### 🐛 Bug Reports

- Use GitHub Issues to report bugs
- Include detailed reproduction steps
- Provide example TSON input/output when relevant

### 💡 Feature Requests

- Open an issue to discuss new features before implementing
- Explain the use case and expected behavior
- Consider backward compatibility

### 📝 Documentation

- Improve existing documentation
- Add examples and use cases
- Fix typos and clarify explanations

### 💻 Code Contributions

#### Language Implementations

We welcome implementations in new languages:

- Follow the core TSON specification in [docs/TSON.md](docs/TSON.md)
- Include comprehensive tests
- Add TypeScript-style type definitions where applicable
- Follow the existing package structure pattern

#### Existing Package Improvements

- **tson-js**: Complete and production-ready ✅
- **tson-rust**: In progress 🚧
- **tson-dart**: In progress 🚧

#### Tools and Extensions

- IDE extensions (IntelliJ, Sublime, etc.)
- Command-line tools
- Online converters/validators

## Development Setup

### For JavaScript/TypeScript (tson-js)

```bash
cd packages/tson-js
npm install
npm test
npm run build
```

### For Rust (tson-rust)

```bash
cd packages/tson-rust
cargo test
cargo build
```

### For Dart (tson-dart)

```bash
cd packages/tson-dart
dart pub get
dart test
```

## Contribution Guidelines

### Code Quality

- Write comprehensive tests for new features
- Follow existing code style and conventions
- Include documentation for public APIs
- Add examples for complex features

### Commit Messages

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

### Pull Requests

- Fork the repository and create a feature branch
- Write clear PR descriptions explaining the changes
- Include tests and documentation updates
- Be responsive to review feedback

## Testing

Each implementation should include:

- Unit tests for all parser/stringifier functions
- Integration tests with real-world examples
- Error handling tests
- Performance benchmarks (optional but welcome)

## Format Specification

The core TSON format is defined in [docs/TSON.md](docs/TSON.md). Any changes to the format itself require:

- Community discussion through GitHub Issues
- Updated documentation
- Backward compatibility considerations
- Updates to all existing implementations

## Questions and Discussion

### 📧 Email Contact

For questions, suggestions, or discussion about contributions:

**Email me**: [mehmedyaz@gmail.com](mailto:mehmedyaz@gmail.com)

### 🐙 GitHub Issues

- Technical questions
- Bug reports
- Feature requests
- Implementation discussions

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## Recognition

All contributors will be recognized in the project README. Thank you for helping make TSON better!

## License

By contributing to TSON, you agree that your contributions will be licensed under the Apache License 2.0, the same license as the project.
