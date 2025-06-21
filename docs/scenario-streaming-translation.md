# Scenario: Streaming Translation Service

**Topic**: Large document translation with progressive delivery to users

**Data Needed**: Title, author, content paragraphs, headings, metadata (word count, target language)

## 1. Structured Output

**Problem**: Cannot stream - user waits for entire document translation

```json
{
  "title": "Introducción a la Programación",
  "author": "John Smith",
  "content": [
    "La programación es el arte de escribir código...",
    "Hay muchos lenguajes de programación...",
    "Comenzando"
  ],
  "metadata": { "words": 1250, "lang": "Spanish" }
}
```

**Tokens**: 77 tokens

## 2. JSONL with {field: value}

**Approach**: Each content segment wrapped in field-value structure

```jsonl
{"field": "title", "value": "Introducción a la Programación"}
{"field": "author", "value": "John Smith"}
{"field": "content", "value": "La programación es el arte de escribir código..."}
{"field": "content", "value": "Hay muchos lenguajes de programación..."}
{"field": "heading", "value": "Comenzando"}
{"field": "metadata", "value": {"words": 1250, "lang": "Spanish"}}
```

**Tokens**: 108 tokens

## 3. TSONL

**Approach**: Direct content streaming, no wrapper overhead

```tsonl
title'Introducción a la Programación'
author'John Smith'
content'La programación es el arte de escribir código...'
content'Hay muchos lenguajes de programación...'
heading'Comenzando'
metadata{words#1250 lang'Spanish'}
```

**Tokens**: 54 tokens

## Comparison

| Approach             | Tokens | Streaming |
| -------------------- | ------ | --------- |
| Structured Output    | 77     | ❌ No     |
| JSONL {field: value} | 108    | ✅ Yes    |
| TSONL                | 54     | ✅ Yes    |
