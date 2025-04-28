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
┌──────────────────┬────────────┬────────────┬───────────────┬─────────────────────────┐
│ Example          │ JSON       │ TSON       │ Reduction     │ Savings M Objects($)    │
├──────────────────┼────────────┼────────────┼───────────────┼─────────────────────────┤
│ complex          │ 612        │ 419        │ 31.54%        │ $1930.00                │
├──────────────────┼────────────┼────────────┼───────────────┼─────────────────────────┤
│ dictionary       │ 209        │ 159        │ 23.92%        │ $500.00                 │
├──────────────────┼────────────┼────────────┼───────────────┼─────────────────────────┤
│ product_array    │ 433        │ 267        │ 38.34%        │ $1660.00                │
├──────────────────┼────────────┼────────────┼───────────────┼─────────────────────────┤
│ repeating        │ 496        │ 365        │ 26.41%        │ $1310.00                │
├──────────────────┼────────────┼────────────┼───────────────┼─────────────────────────┤
│ schema           │ 828        │ 365        │ 55.92%        │ $4630.00                │
├──────────────────┼────────────┼────────────┼───────────────┼─────────────────────────┤
│ user_orders      │ 576        │ 392        │ 31.94%        │ $1840.00                │
└──────────────────┴────────────┴────────────┴───────────────┴─────────────────────────┘

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
