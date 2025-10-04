const { spawn } = require('child_process');
const path = require('path');

/**
 * Python Scraper Wrapper
 * Calls the Python scraper as a subprocess and returns the result
 */

/**
 * Scrapes a product using the Python scraper
 * @param {string} url - The product URL to scrape
 * @returns {Promise<Object>} Scraped product data
 */
async function scrapeWithPython(url) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'python_scraper.py');
    
    // Create a temporary script to run the scraper with the URL
    const tempScript = `
import sys
import json
from python_scraper import ProductScraper

if len(sys.argv) > 1:
    url = sys.argv[1]
    scraper = ProductScraper()
    result = scraper.scrape_product(url)
    print(json.dumps(result))
else:
    print(json.dumps({"error": "No URL provided"}))
`;

    // Write temp script
    const fs = require('fs');
    const tempScriptPath = path.join(__dirname, 'temp_scraper.py');
    fs.writeFileSync(tempScriptPath, tempScript);

    // Run Python script
    const pythonProcess = spawn('python', [tempScriptPath, url], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up temp file
      try {
        fs.unlinkSync(tempScriptPath);
      } catch (err) {
        console.warn('Could not delete temp script:', err.message);
      }

      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse Python output: ${err.message}\nOutput: ${output}`));
        }
      } else {
        reject(new Error(`Python script failed with code ${code}\nError: ${errorOutput}\nOutput: ${output}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

    // Set timeout
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python scraper timeout'));
    }, 30000); // 30 second timeout
  });
}

/**
 * Checks if Python and required packages are available
 * @returns {Promise<boolean>} True if Python scraper is available
 */
async function checkPythonAvailability() {
  return new Promise((resolve) => {
    const pythonProcess = spawn('python', ['-c', 'import requests, bs4, selenium; print("OK")'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.on('close', (code) => {
      resolve(code === 0);
    });

    pythonProcess.on('error', () => {
      resolve(false);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      pythonProcess.kill();
      resolve(false);
    }, 5000);
  });
}

module.exports = {
  scrapeWithPython,
  checkPythonAvailability
};

