const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

function getBaseFileNameAndExtension(filePath) {
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(fileName);
  const fileBaseName = path.basename(fileName, fileExtension);
  return {
    fileName,
    fileExtension,
    fileBaseName
  };
}

function convertToMp3(inputFilePath, outputDir) {
  const { fileBaseName, fileName: inputFileName } = getBaseFileNameAndExtension(inputFilePath);

  const outputFileExtension = '.mp3';

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Output file path (in the subdirectory with a .mp3 extension)
  const outputFilePath = path.join(outputDir, fileBaseName + outputFileExtension);

  // Perform the conversion
  ffmpeg()
    .input(inputFilePath)
    .audioCodec('libmp3lame') // Use the MP3 codec
    .toFormat('mp3')
    .on('start', (commandLine) => {
      console.log('Converting ' + inputFileName + ' to MP3...');
    })
    .on('end', () => {
      console.log(inputFileName+ ' is converted to ' + fileBaseName + outputFileExtension);
    })
    .on('error', (err) => {
      console.error('Error:', err);
    })
    .save(outputFilePath);
}

// Get input file paths from the directory
function getInputFilePaths(inputFileDir) {
  const inputFileNames = fs.readdirSync(inputFileDir);
  const inputFilePaths = inputFileNames.map((inputFileName) => {
    return path.join(inputFileDir, inputFileName);
  });
  return inputFilePaths;
}

function main() {
  const inputDir = path.join(__dirname, '..', '_input');
  const outputDir = path.join(__dirname, '..', '_output');
  const inputFilePaths = getInputFilePaths(inputDir);
  
  inputFilePaths.forEach((inputFilePath) => {
    convertToMp3(inputFilePath, outputDir);
  });
}

main();
