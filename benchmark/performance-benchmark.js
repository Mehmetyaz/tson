const fs = require("fs");
const path = require("path");
const Table = require("cli-table3");
const {
  parse,
  stringify,
  tsonToJSON,
  jsonToTSON,
} = require("../packages/tson-js");

// Native JSON methods for comparison
const nativeJSON = {
  parse: JSON.parse,
  stringify: JSON.stringify,
};

// File paths
const jsonDir = path.join(__dirname, "examples", "json");
const tsonDir = path.join(__dirname, "examples", "tson");

// Number of iterations for each test to get reliable results
const ITERATIONS = 1000000; // 1 M iterations

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

// Time execution of a function
function timeExecution(fn, iterations = 1) {
  const startTime = process.hrtime.bigint();

  // Run the function multiple times for more accurate measurement
  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const endTime = process.hrtime.bigint();
  const timeInMs = Number(endTime - startTime) / 1_000_000; // Convert ns to ms

  return {
    totalTimeMs: timeInMs, // Total execution time for all iterations
  };
}

// Format number with fixed decimal places
function formatNumber(num, decimals = 2) {
  return num.toFixed(decimals);
}

// Calculate performance ratio
function calculateRatio(jsonTime, tsonTime) {
  if (jsonTime <= 0 || tsonTime <= 0) return "N/A";
  return (jsonTime / tsonTime).toFixed(2) + "x";
}

// Run the benchmark
async function runBenchmark() {
  console.log("Running performance benchmark for JSON vs TSON...\n");
  console.log(
    `Testing with ${ITERATIONS.toLocaleString()} total iterations per operation`
  );

  const examples = getExamples();
  const results = {
    stringToObj: [], // String parsing (JSON.parse / TSON parse)
    objToString: [], // Object serialization (JSON.stringify / TSON stringify)
  };

  for (const example of examples) {
    try {
      console.log(`Processing ${example.name}...`);

      const jsonContent = fs
        .readFileSync(example.jsonPath, "utf8")
        .split("\n")[0]; // Take first line for simplicity
      const tsonContent = fs
        .readFileSync(example.tsonPath, "utf8")
        .split("\n")[0]; // Take first line for simplicity

      if (!jsonContent || !tsonContent) {
        console.log(`Skipping ${example.name} - empty content`);
        continue;
      }

      // 1. Test STRING → OBJECT (parsing)
      // Test string → JSON Object
      const jsonParseResult = timeExecution(() => {
        nativeJSON.parse(jsonContent);
      }, ITERATIONS);

      // Test string → TSON Object
      const tsonParseResult = timeExecution(() => {
        parse(tsonContent);
      }, ITERATIONS);

      // 2. Test OBJECT → STRING (stringifying)
      const jsonObj = nativeJSON.parse(jsonContent);
      const tsonObj = parse(tsonContent);

      // Test JSON Object → string
      const jsonStringifyResult = timeExecution(() => {
        nativeJSON.stringify(jsonObj);
      }, ITERATIONS);

      // Test TSON Object → string
      const tsonStringifyResult = timeExecution(() => {
        stringify(tsonObj);
      }, ITERATIONS);

      // Store results
      results.stringToObj.push({
        name: example.name,
        jsonTimeMs: jsonParseResult.totalTimeMs,
        tsonTimeMs: tsonParseResult.totalTimeMs,
        ratio: calculateRatio(
          jsonParseResult.totalTimeMs,
          tsonParseResult.totalTimeMs
        ),
      });

      results.objToString.push({
        name: example.name,
        jsonTimeMs: jsonStringifyResult.totalTimeMs,
        tsonTimeMs: tsonStringifyResult.totalTimeMs,
        ratio: calculateRatio(
          jsonStringifyResult.totalTimeMs,
          tsonStringifyResult.totalTimeMs
        ),
      });
    } catch (error) {
      console.error(`Error processing ${example.name}: ${error.message}`);
    }
  }

  // Display results
  console.log(
    `\n=== STRING → OBJECT Parsing Performance for ${ITERATIONS.toLocaleString()} operations (Lower is better) ===`
  );
  displayTable(
    results.stringToObj,
    ["name", "jsonTimeMs", "tsonTimeMs", "ratio"],
    ["Example", "JSON (ms)", "TSON (ms)", "JSON/TSON ratio"]
  );

  console.log(
    `\n=== OBJECT → STRING Serialization Performance for ${ITERATIONS.toLocaleString()} operations (Lower is better) ===`
  );
  displayTable(
    results.objToString,
    ["name", "jsonTimeMs", "tsonTimeMs", "ratio"],
    ["Example", "JSON (ms)", "TSON (ms)", "JSON/TSON ratio"]
  );

  // Calculate averages
  calculateAverages(results);
}

// Display results in a table
function displayTable(data, keys, headers) {
  const table = new Table({
    head: headers,
    colWidths: headers.map((h) => Math.max(h.length + 4, 15)),
  });

  for (const row of data) {
    const tableRow = keys.map((key) => {
      if (key === "name") return row[key];
      return typeof row[key] === "number" ? formatNumber(row[key]) : row[key];
    });
    table.push(tableRow);
  }

  console.log(table.toString());
}

// Calculate and display average results
function calculateAverages(results) {
  console.log(
    `\n=== Average Performance Results for ${ITERATIONS.toLocaleString()} operations ===`
  );

  // String → Object parsing averages
  const parseAvgJson =
    results.stringToObj.reduce((sum, r) => sum + r.jsonTimeMs, 0) /
    results.stringToObj.length;
  const parseAvgTson =
    results.stringToObj.reduce((sum, r) => sum + r.tsonTimeMs, 0) /
    results.stringToObj.length;
  console.log(
    `String → Object: JSON total avg: ${formatNumber(
      parseAvgJson
    )} ms, TSON total avg: ${formatNumber(parseAvgTson)} ms`
  );
  console.log(
    `JSON parsing is ${calculateRatio(
      parseAvgJson,
      parseAvgTson
    )} compared to TSON parsing`
  );

  // Object → String serialization averages
  const stringifyAvgJson =
    results.objToString.reduce((sum, r) => sum + r.jsonTimeMs, 0) /
    results.objToString.length;
  const stringifyAvgTson =
    results.objToString.reduce((sum, r) => sum + r.tsonTimeMs, 0) /
    results.objToString.length;
  console.log(
    `\nObject → String: JSON total avg: ${formatNumber(
      stringifyAvgJson
    )} ms, TSON total avg: ${formatNumber(stringifyAvgTson)} ms`
  );
  console.log(
    `JSON serialization is ${calculateRatio(
      stringifyAvgJson,
      stringifyAvgTson
    )} compared to TSON serialization`
  );
}

// Run the benchmark
runBenchmark()
  .then(() => console.log("\nBenchmark completed"))
  .catch((err) => console.error("Benchmark failed:", err));
