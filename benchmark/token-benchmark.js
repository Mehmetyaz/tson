const fs = require("fs");
const path = require("path");
const { encoding_for_model } = require("tiktoken");
const Table = require("cli-table3");

// File paths
const jsonDir = path.join(__dirname, "examples", "json");
const tsonDir = path.join(__dirname, "examples", "tson");

// Models to benchmark against
const MODELS = ["gpt-4", "gpt-3.5-turbo"];

// Get list of examples
const getExamples = () => {
  const jsonFiles = fs
    .readdirSync(jsonDir)
    .filter((file) => file.endsWith(".jsonl"));
  return jsonFiles.map((file) => ({
    name: path.basename(file, ".jsonl"),
    jsonPath: path.join(jsonDir, file),
    tsonPath: path.join(tsonDir, file.replace(".jsonl", ".tsonl")),
  }));
};

// Count tokens using tiktoken
function countTokens(text, model) {
  try {
    const enc = encoding_for_model(model);
    const tokens = enc.encode(text);
    enc.free();
    return tokens.length;
  } catch (error) {
    console.error(`Error counting tokens for model ${model}: ${error.message}`);
    return -1;
  }
}

// Run benchmark
async function runBenchmark() {
  console.log("Running token count benchmark for JSON vs TSON...\n");

  const examples = getExamples();
  const modelResults = {};

  // Initialize results for each model
  MODELS.forEach((model) => {
    modelResults[model] = [];
  });

  for (const example of examples) {
    try {
      const jsonContent = fs.readFileSync(example.jsonPath, "utf8");
      const tsonContent = fs.readFileSync(example.tsonPath, "utf8");

      for (const model of MODELS) {
        const jsonTokens = countTokens(jsonContent, model);
        const tsonTokens = countTokens(tsonContent, model);

        const tokenReduction =
          jsonTokens > 0
            ? (((jsonTokens - tsonTokens) / jsonTokens) * 100).toFixed(2)
            : "N/A";
        const bytesReduction =
          ((Buffer.byteLength(jsonContent) - Buffer.byteLength(tsonContent)) /
            Buffer.byteLength(jsonContent)) *
          100;

        modelResults[model].push({
          name: example.name,
          jsonTokens,
          tsonTokens,
          tokenReduction,
          jsonBytes: Buffer.byteLength(jsonContent),
          tsonBytes: Buffer.byteLength(tsonContent),
          bytesReduction: bytesReduction.toFixed(2),
        });
      }

      console.log(`Processed ${example.name}`);
    } catch (error) {
      console.error(`Error processing ${example.name}: ${error.message}`);
    }
  }

  // Display results for each model
  for (const model of MODELS) {
    console.log(`\n=== Model: ${model} ===`);

    const table = new Table({
      head: [
        "Example",
        "JSON Tokens",
        "TSON Tokens",
        "Token Reduction",
        "JSON Bytes",
        "TSON Bytes",
        "Bytes Reduction",
      ],
      colWidths: [18, 12, 12, 15, 12, 12, 15],
    });

    for (const result of modelResults[model]) {
      table.push([
        result.name,
        result.jsonTokens,
        result.tsonTokens,
        `${result.tokenReduction}%`,
        result.jsonBytes,
        result.tsonBytes,
        `${result.bytesReduction}%`,
      ]);
    }

    console.log(table.toString());

    // Calculate average reductions
    const validResults = modelResults[model].filter(
      (r) => r.jsonTokens > 0 && r.tsonTokens > 0
    );
    if (validResults.length > 0) {
      const avgTokenReduction =
        validResults.reduce((sum, r) => sum + parseFloat(r.tokenReduction), 0) /
        validResults.length;
      const avgBytesReduction =
        validResults.reduce((sum, r) => sum + parseFloat(r.bytesReduction), 0) /
        validResults.length;
      console.log(
        `\nAverage token reduction: ${avgTokenReduction.toFixed(2)}%`
      );
      console.log(`Average bytes reduction: ${avgBytesReduction.toFixed(2)}%`);
    }
  }
}

// Run the benchmark
runBenchmark()
  .then(() => console.log("\nBenchmark completed"))
  .catch((err) => console.error("Benchmark failed:", err));
