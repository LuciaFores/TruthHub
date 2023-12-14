const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY || "";
const pinataApiSecret = process.env.PINATA_API_SECRET || "";
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

// use to store the Images to the pinata ipfs node
async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);

  // read entire directory with readdirSync
  // Filter the files in case the are a file that in not a .png
  const files = fs
    .readdirSync(fullImagesPath)
    .filter((file) => file.includes(".png"));

  console.log(files);
  // response from pinata server
  let responses = [];
  console.log("Uploading to IPFS");

  for (const fileIndex in files) {
    // create a stream where stream all the data inside of these images
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    const options = {
      pinataMetadata: {
        name: files[fileIndex],
      },
    };
    try {
      // will return the hash of files
      await pinata
        .pinFileToIPFS(readableStreamForFile, options)
        .then((result) => {
          // push the file to the pinata ipfs server
          responses.push(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
  return { responses, files };
}

// use to store the metadata to the pinata ipfs node
async function storeTokenUriMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  };
  try {
    const response = await pinata.pinJSONToIPFS(metadata, options);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}

module.exports = { storeImages, storeTokenUriMetadata };
