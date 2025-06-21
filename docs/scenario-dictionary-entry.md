# Scenario: Dictionary Entry Generation

**Topic**: Creating structured dictionary entries with metadata, explanations, and examples

**Data Needed**: Word metadata (IPA, type, domains), text explanations, visual examples, audio use cases

## 1. Structured Output

**Problem**: Cannot stream - user waits for complete entry generation

```json
{
  "metadata": {
    "word": "run",
    "ipa": ["r", "ʌ", "n"],
    "type": "verb",
    "domains": ["action", "sports"]
  },
  "text": "To move at a speed faster than walking.",
  "picture": "Person jogging in park",
  "usecase": {
    "context": "fitness",
    "audio": "<voice>I run every morning.</voice>"
  }
}
```

**Tokens**: 99 tokens

## 2. JSONL with {type: payload}

**Approach**: Each content type wrapped in type-payload structure

```jsonl
{"field": "metadata", "value": {"word": "run", "ipa": ["r", "ʌ", "n"], "type": "verb", "domains": ["action", "sports"]}}
{"field": "text", "value": "To move at a speed faster than walking."}
{"field": "picture", "value": "Person jogging in park"}
{"field": "usecase", "value": {"context": "fitness", "audio": "<voice>I run every morning.</voice>"}}
```

**Tokens**: 110 tokens

## 3. TSONL

**Approach**: Direct content types, no wrapper overhead

```tsonl
metadata{word'run' ipa['r' 'ʌ' 'n'] type'verb' domains['action' 'sports']}
text'To move at a speed faster than walking.'
picture'Person jogging in park'
usecase{context'fitness' audio'<voice>I run every morning.</voice>'}
```

**Tokens**: 66 tokens

## Comparison

| Approach              | Tokens | Streaming |
| --------------------- | ------ | --------- |
| Structured Output     | 99     | ❌ No     |
| JSONL {type: payload} | 110    | ✅ Yes    |
| TSONL                 | 66     | ✅ Yes    |
