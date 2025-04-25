# TSON vs JSON Token Benchmark

This benchmark compares token counts between JSON and TSON formats using OpenAI's tokenizer for different models.

## Features

- Measures token counts for different models (GPT-4, GPT-3.5-Turbo)
- Compares file sizes in bytes
- Calculates token and byte reduction percentages
- Shows detailed results in a formatted table

## Requirements

- Node.js (>= 14.x)
- NPM

## Installation

Install the dependencies:

```bash
npm install
```

## Usage

Run the benchmark:

```bash
npm run benchmark
```

## Example Output

```
=== Model: gpt-4 ===
┌──────────────────┬────────────┬────────────┬───────────────┬────────────┬────────────┬───────────────┐
│ Example          │ JSON Tokens│ TSON Tokens│ Token Reduction│ JSON Bytes │ TSON Bytes │ Bytes Reduction│
├──────────────────┼────────────┼────────────┼───────────────┼────────────┼────────────┼───────────────┤
│ product_array    │ 168        │ 122        │ 27.38%        │ 1504       │ 928        │ 38.30%        │
│ schema           │ 284        │ 210        │ 26.06%        │ 2456       │ 1824       │ 25.73%        │
│ complex          │ 256        │ 195        │ 23.83%        │ 2224       │ 1664       │ 25.18%        │
│ repeating        │ 183        │ 135        │ 26.23%        │ 1584       │ 1152       │ 27.27%        │
│ dictionary       │ 124        │ 96         │ 22.58%        │ 988        │ 767        │ 22.37%        │
│ user_orders      │ 220        │ 160        │ 27.27%        │ 1813       │ 1232       │ 32.05%        │
└──────────────────┴────────────┴────────────┴───────────────┴────────────┴────────────┴───────────────┘

Average token reduction: 25.56%
Average bytes reduction: 28.48%
```

## How It Works

The benchmark:

1. Reads the content of JSON and TSON files from the examples directory
2. Counts tokens for each format using tiktoken's tokenizer for each model
3. Calculates byte sizes and reduction percentages
4. Displays the results in a table

The token counting directly uses the same tokenizers that OpenAI's models use, providing an accurate representation of how many tokens would be used when sending data to OpenAI API.
