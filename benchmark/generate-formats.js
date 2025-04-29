const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { stringify, parse } = require("../packages/tson-js").TSON;

// Paths
const examplesDir = path.join(__dirname, "examples");
const generatedDir = path.join(__dirname, "examples", "generated");
const tsonOutputDir = path.join(generatedDir, "tson");
const yamlOutputDir = path.join(generatedDir, "yaml");

// Ensure output directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Process all files in the examples directory
function generateFormats() {
  // Ensure output directories exist
  ensureDirectoryExists(generatedDir);
  ensureDirectoryExists(tsonOutputDir);
  ensureDirectoryExists(yamlOutputDir);

  const files = fs.readdirSync(examplesDir);
  const jsonlFiles = files.filter((file) => file.endsWith(".jsonl"));

  if (jsonlFiles.length === 0) {
    console.log("No JSONL files found in examples directory.");
    return;
  }

  jsonlFiles.forEach((file) => {
    const filePath = path.join(examplesDir, file);
    const tsonOutputPath = path.join(
      tsonOutputDir,
      file.replace(".jsonl", ".tsonl")
    );
    const yamlOutputPath = path.join(
      yamlOutputDir,
      file.replace(".jsonl", ".yaml")
    );

    console.log(`Processing ${file}...`);

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n").filter((line) => line.trim());

      let tsonContent = "";
      let yamlContent = "";

      lines.forEach((line) => {
        if (line.trim()) {
          try {
            // Parse JSON to object
            const obj = JSON.parse(line);

            // Convert to TSON using tson-js library
            const tsonLine = stringify(obj, false); // false for multi-line formatting
            tsonContent += tsonLine + "\n";

            // Convert to YAML
            const yamlLine = yaml.dump(obj);
            yamlContent += "---\n" + yamlLine;
          } catch (err) {
            console.error(`Error processing line: ${err.message}`);
          }
        }
      });

      fs.writeFileSync(tsonOutputPath, tsonContent);
      fs.writeFileSync(yamlOutputPath, yamlContent);

      console.log(
        `Successfully created ${tsonOutputPath} and ${yamlOutputPath}`
      );
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  });

  console.log("Format conversion completed!");
}

// Export the function
module.exports = { generateFormats };

// Run the function if this script is executed directly
if (require.main === module) {
  generateFormats();
}
