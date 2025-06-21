# Scenario: Multi-Part Content Generation

**Topic**: AI system generating educational content with multiple content types (text, pictures, audio, metadata)

**Data Needed**: Content descriptions with types, metadata (description, difficulty, duration)

## 1. Structured Output

**Problem**: Cannot stream - user waits for complete response

```json
{
  "metadata": {
    "description": "Educational content about present tense",
    "difficulty": 3,
    "duration": 45
  },
  "desc": [
    {
      "text": "<h1>Present Tense</h1><p>Used for current actions.</p>"
    },
    {
      "picture": "Students practicing verb conjugation in classroom"
    },
    {
      "text": "<p>Here an example:</p>"
    },
    {
      "audio": "<voice>I am studying English grammar.</voice>"
    }
  ]
}
```

**Tokens**: 121 tokens

## 2. JSONL with {field: value}

**Approach**: Wrapper objects for each content type - LLM signals before description (server handles the case)

```jsonl
{"field": "metadata", "value": {"description": "Educational content about present tense", "difficulty": 3, "duration": 45}}
{"field": "desc", "value": true}
{"type": "text", "value": "<h1>Present Tense</h1><p>Used for current actions.</p>"}
{"type": "picture", "value": "Students practicing verb conjugation in classroom"}
{"type": "text", "value": "<p>Here an example:</p>"}
{"type": "audio", "value": "<voice>I am studying English grammar.</voice>"}
```

**Tokens**: 131 tokens

## 3. TSONL

**Approach**: Named root values, no wrapper overhead, LLM signals before description (server handles the case)

```tsonl
metadata{description'Educational content about present tense' difficulty#3 duration#45}
desc?true
text'<h1>Present Tense</h1><p>Used for current actions.</p>'
picture'Students practicing verb conjugation in classroom'
text'<p>Here an example:</p>'
audio'<voice>I am studying English grammar.</voice>'
```

**Tokens**: 77 tokens

## Comparison

| Approach             | Tokens | Streaming |
| -------------------- | ------ | --------- |
| Structured Output    | 121    | ❌ No     |
| JSONL {field: value} | 131    | ✅ Yes    |
| TSONL                | 77     | ✅ Yes    |
