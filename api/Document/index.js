const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { generateBlobSASQueryParameters, SASProtocol, BlobSASPermissions } = require("@azure/storage-blob");


const accountName = process.env["storageAccountName"];
const accountKey = process.env["StorageAccountKey"];

module.exports = async function (context, req) {
  const fileNames = (req.query.fileNames || (req.body && req.body.fileNames));
  const containerName = (req.query.containerName || (req.body && req.body.containerName));

  if (fileNames && Array.isArray(fileNames)) {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const urls = await Promise.all(fileNames.map(async (fileName) => {
      const blobClient = containerClient.getBlobClient(fileName);
      const blobSas = generateBlobSASQueryParameters({
        containerName: containerClient.containerName,
        blobName: blobClient.name,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000), // 5 minutes ago
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour later
        protocol: SASProtocol.Https,
      }, sharedKeyCredential);

      return {
        [fileName]: `${blobClient.url}?${blobSas}`
      };
    }));

    context.res = {
      body: urls
    };
  } else {
    context.res = {
      status: 400,
      body: "Please provide a fileNames query parameter as an array."
    };
  }
};
