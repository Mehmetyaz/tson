const fs = require("fs");
const path = require("path");
const { encoding_for_model, get_encoding } = require("tiktoken");
const Table = require("cli-table3");

// File paths
const examplesDir = path.join(__dirname, "examples");
const generatedDir = path.join(__dirname, "examples", "generated");
const jsonDir = examplesDir;
const tsonDir = path.join(generatedDir, "tson");
const yamlDir = path.join(generatedDir, "yaml");
const resultFile = path.join(__dirname, "token-results.md");
const { generateFormats } = require("./generate-formats");
generateFormats();

// Encodings and their associated models
const ENCODINGS = {
  o200k_base: ["gpt-4.5-preview", "gpt-4.1", "gpt-4o", "o1", "o3"],
  cl100k_base: ["gpt-4", "gpt-4-turbo"],
};

// Output prices per 1M tokens in USD
const OUTPUT_PRICES = {
  "gpt-4.5-preview": 150,
  "gpt-4.1": 8,
  "gpt-4o": 10,
  o1: 60,
  o3: 40,
  "gpt-4": 60,
  "gpt-4-turbo": 30,
};

// String to store markdown output
let markdownOutput = `# JSON vs TSON vs YAML Token Benchmark Results\n\n`;

// Function to log both to console and to the markdown string
function log(text) {
  console.log(text);
  markdownOutput += text + "\n";
}

// Get list of examples
const getExamples = () => {
  const jsonFiles = fs
    .readdirSync(jsonDir)
    .filter((file) => file.endsWith(".jsonl"));
  return jsonFiles.map((file) => ({
    name: path.basename(file, ".jsonl"),
    jsonPath: path.join(jsonDir, file),
    tsonPath: path.join(tsonDir, file.replace(".jsonl", ".tsonl")),
    yamlPath: path.join(yamlDir, file.replace(".jsonl", ".yaml")),
  }));
};

// Count tokens using tiktoken
function countTokens(text, encoding) {
  try {
    const enc = get_encoding(encoding);
    const tokens = enc.encode(text);
    enc.free();
    return tokens.length;
  } catch (error) {
    console.error(
      `Error counting tokens for encoding ${encoding}: ${error.message}`
    );
    return -1;
  }
}

// Calculate cost savings per million objects
function calculateCostSavings(jsonTokens, formatTokens, pricePerMillion) {
  if (jsonTokens <= 0 || formatTokens <= 0) return "N/A";
  const tokenSavings = jsonTokens - formatTokens;
  // Calculate cost savings per million objects
  const savingsPerMillion = (tokenSavings * pricePerMillion).toFixed(2);
  return savingsPerMillion;
}

// Run benchmark
async function runBenchmark() {
  log("Running token count benchmark for JSON vs TSON vs YAML...\n");

  const examples = getExamples();
  const encodingResults = {};

  // Initialize results for each encoding
  for (const encoding in ENCODINGS) {
    encodingResults[encoding] = [];
  }

  for (const example of examples) {
    try {
      const jsonContent = fs.readFileSync(example.jsonPath, "utf8");
      const tsonContent = fs.readFileSync(example.tsonPath, "utf8");
      const yamlContent = fs.readFileSync(example.yamlPath, "utf8");

      // Process each encoding
      for (const encoding in ENCODINGS) {
        const jsonTokens = countTokens(jsonContent, encoding);
        const tsonTokens = countTokens(tsonContent, encoding);
        const yamlTokens = countTokens(yamlContent, encoding);

        const tsonTokenReduction =
          jsonTokens > 0
            ? (((jsonTokens - tsonTokens) / jsonTokens) * 100).toFixed(2)
            : "N/A";
        const yamlTokenReduction =
          jsonTokens > 0
            ? (((jsonTokens - yamlTokens) / jsonTokens) * 100).toFixed(2)
            : "N/A";

        const tsonBytesReduction =
          ((Buffer.byteLength(jsonContent) - Buffer.byteLength(tsonContent)) /
            Buffer.byteLength(jsonContent)) *
          100;
        const yamlBytesReduction =
          ((Buffer.byteLength(jsonContent) - Buffer.byteLength(yamlContent)) /
            Buffer.byteLength(jsonContent)) *
          100;

        encodingResults[encoding].push({
          name: example.name,
          jsonTokens,
          tsonTokens,
          yamlTokens,
          tsonTokenReduction,
          yamlTokenReduction,
          jsonBytes: Buffer.byteLength(jsonContent),
          tsonBytes: Buffer.byteLength(tsonContent),
          yamlBytes: Buffer.byteLength(yamlContent),
          tsonBytesReduction: tsonBytesReduction.toFixed(2),
          yamlBytesReduction: yamlBytesReduction.toFixed(2),
          tsonTokenDifference: jsonTokens - tsonTokens,
          yamlTokenDifference: jsonTokens - yamlTokens,
        });
      }

      log(`Processed ${example.name}`);
    } catch (error) {
      console.error(`Error processing ${example.name}: ${error.message}`);
    }
  }

  // Display results for each encoding
  for (const encoding in ENCODINGS) {
    // Show which models use this encoding
    const models = ENCODINGS[encoding].join(", ");
    log(`\n## Encoding: ${encoding}\n`);
    log(`**Used by models:** ${models}\n`);

    // Create a new table with just formats as columns
    const table = new Table({
      head: ["Example", "JSON", "YAML", "TSON"],
      colWidths: [20, 20, 20, 20],
      style: {
        head: [], // Disable colors for markdown export
        border: [], // Disable colors for markdown export
      },
    });

    // For markdown, we'll create a markdown table
    let mdTable = `| Example | JSON | YAML | TSON |\n`;
    mdTable += `| ------- | ---- | ---- | ---- |\n`;

    for (const result of encodingResults[encoding]) {
      // Create cell contents with token count and reduction percentage
      const jsonCell = `${result.jsonTokens} (100%)`;
      const yamlCell = `${result.yamlTokens} (-${result.yamlTokenReduction}%)`;
      const tsonCell = `${result.tsonTokens} (-${result.tsonTokenReduction}%)`;

      table.push([result.name, jsonCell, yamlCell, tsonCell]);

      // Add row to markdown table
      mdTable += `| ${result.name} | ${jsonCell} | ${yamlCell} | ${tsonCell} |\n`;
    }

    // Add table to console output
    console.log(table.toString());

    // Add markdown table to output
    markdownOutput += mdTable + "\n";

    // Calculate average reductions
    const validResults = encodingResults[encoding].filter(
      (r) => r.jsonTokens > 0 && r.tsonTokens > 0 && r.yamlTokens > 0
    );
    if (validResults.length > 0) {
      const avgTsonTokenReduction =
        validResults.reduce(
          (sum, r) => sum + parseFloat(r.tsonTokenReduction),
          0
        ) / validResults.length;
      const avgYamlTokenReduction =
        validResults.reduce(
          (sum, r) => sum + parseFloat(r.yamlTokenReduction),
          0
        ) / validResults.length;

      log(
        `\n**Average TSON token reduction:** -${avgTsonTokenReduction.toFixed(
          2
        )}%`
      );
      log(
        `**Average YAML token reduction:** -${avgYamlTokenReduction.toFixed(
          2
        )}%`
      );
    }

    // Show model-specific savings for 100k outputs
    log(`\n### Cost Savings by Model for 100k Outputs (${encoding})\n`);

    const savingsTable = new Table({
      head: [
        "Model",
        "JSON (Total Cost)",
        "YAML (Cost & Savings)",
        "TSON (Cost & Savings)",
      ],
      colWidths: [25, 25, 25, 25],
    });

    // For markdown
    let mdSavingsTable = `| Model | JSON (Total Cost) | YAML (Cost & Savings) | TSON (Cost & Savings) |\n`;
    mdSavingsTable += `| ----- | ----------------- | -------------------- | -------------------- |\n`;

    // Calculate average token counts across all examples for this encoding
    const avgJsonTokens =
      validResults.length > 0
        ? validResults.reduce((sum, r) => sum + r.jsonTokens, 0) /
          validResults.length
        : 0;
    const avgTsonTokens =
      validResults.length > 0
        ? validResults.reduce((sum, r) => sum + r.tsonTokens, 0) /
          validResults.length
        : 0;
    const avgYamlTokens =
      validResults.length > 0
        ? validResults.reduce((sum, r) => sum + r.yamlTokens, 0) /
          validResults.length
        : 0;

    for (const model of ENCODINGS[encoding]) {
      const modelPrice = OUTPUT_PRICES[model];

      // Calculate costs for 100k outputs
      const jsonCost = (
        ((avgJsonTokens * 100000) / 1000000) *
        modelPrice
      ).toFixed(2);
      const yamlCost = (
        ((avgYamlTokens * 100000) / 1000000) *
        modelPrice
      ).toFixed(2);
      const tsonCost = (
        ((avgTsonTokens * 100000) / 1000000) *
        modelPrice
      ).toFixed(2);

      // Calculate savings
      const yamlSavings = (parseFloat(jsonCost) - parseFloat(yamlCost)).toFixed(
        2
      );
      const tsonSavings = (parseFloat(jsonCost) - parseFloat(tsonCost)).toFixed(
        2
      );

      savingsTable.push([
        `${model} ($${modelPrice}/1M)`,
        `$${jsonCost}`,
        `$${yamlCost} (-$${yamlSavings})`,
        `$${tsonCost} (-$${tsonSavings})`,
      ]);

      // Add to markdown table
      mdSavingsTable += `| ${model} ($${modelPrice}/1M) | $${jsonCost} | $${yamlCost} (-$${yamlSavings}) | $${tsonCost} (-$${tsonSavings}) |\n`;
    }

    // Print the savings table
    console.log(savingsTable.toString());
    markdownOutput += mdSavingsTable + "\n";

    // Extra line to separate encodings
    log("=" + "=".repeat(70) + "=");
    log(""); // Extra line for more spacing
  }
}

// Run the benchmark
runBenchmark()
  .then(() => {
    log("\n## Benchmark completed\n");

    // Write results to markdown file
    fs.writeFileSync(resultFile, markdownOutput);
    console.log(`\nResults saved to ${resultFile}`);

    // Hack to ensure PowerShell properly displays all content
    console.log("\n\n");
  })
  .catch((err) => console.error("Benchmark failed:", err));
