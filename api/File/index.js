const { BlobServiceClient } = require("@azure/storage-blob");

// Replace these values with your actual Azure Storage account information
const connectionString = process.env["ConnectionString"];
const containerName = process.env["ContainerUpload"];


module.exports = async function (context, req) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const files = req.body.files;

    for (let file of files) {
        const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
        const buffer = Buffer.from(file.base64.split(",")[1], 'base64');
        await blockBlobClient.uploadData(buffer);
    }

    context.res = {
        status: 200,
        body: "Files uploaded successfully"
    };
};
