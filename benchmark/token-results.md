# JSON vs TSON vs YAML Token Benchmark Results

Running token count benchmark for JSON vs TSON vs YAML...

Processed complex
Processed dictionary
Processed repeating
Processed user_orders

## Encoding: o200k_base

**Used by models:** gpt-4.5-preview, gpt-4.1, gpt-4o, o1, o3

| Example | JSON | YAML | TSON |
| ------- | ---- | ---- | ---- |
| complex | 632 (100%) | 581 (-8.07%) | 475 (-24.84%) |
| dictionary | 206 (100%) | 195 (-5.34%) | 162 (-21.36%) |
| repeating | 521 (100%) | 483 (-7.29%) | 409 (-21.50%) |
| user_orders | 591 (100%) | 533 (-9.81%) | 435 (-26.40%) |


**Average TSON token reduction:** -23.52%
**Average YAML token reduction:** -7.63%

### Cost Savings by Model for 100k Outputs (o200k_base)

| Model | JSON (Total Cost) | YAML (Cost & Savings) | TSON (Cost & Savings) |
| ----- | ----------------- | -------------------- | -------------------- |
| gpt-4.5-preview ($150/1M) | $7312.50 | $6720.00 (-$592.50) | $5553.75 (-$1758.75) |
| gpt-4.1 ($8/1M) | $390.00 | $358.40 (-$31.60) | $296.20 (-$93.80) |
| gpt-4o ($10/1M) | $487.50 | $448.00 (-$39.50) | $370.25 (-$117.25) |
| o1 ($60/1M) | $2925.00 | $2688.00 (-$237.00) | $2221.50 (-$703.50) |
| o3 ($40/1M) | $1950.00 | $1792.00 (-$158.00) | $1481.00 (-$469.00) |

========================================================================


## Encoding: cl100k_base

**Used by models:** gpt-4, gpt-4-turbo

| Example | JSON | YAML | TSON |
| ------- | ---- | ---- | ---- |
| complex | 616 (100%) | 571 (-7.31%) | 460 (-25.32%) |
| dictionary | 209 (100%) | 196 (-6.22%) | 165 (-21.05%) |
| repeating | 496 (100%) | 458 (-7.66%) | 384 (-22.58%) |
| user_orders | 576 (100%) | 518 (-10.07%) | 420 (-27.08%) |


**Average TSON token reduction:** -24.01%
**Average YAML token reduction:** -7.81%

### Cost Savings by Model for 100k Outputs (cl100k_base)

| Model | JSON (Total Cost) | YAML (Cost & Savings) | TSON (Cost & Savings) |
| ----- | ----------------- | -------------------- | -------------------- |
| gpt-4 ($60/1M) | $2845.50 | $2614.50 (-$231.00) | $2143.50 (-$702.00) |
| gpt-4-turbo ($30/1M) | $1422.75 | $1307.25 (-$115.50) | $1071.75 (-$351.00) |

========================================================================


## Benchmark completed

