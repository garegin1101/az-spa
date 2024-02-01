import { AzureFunction, Context } from "@azure/functions";
import * as csv from 'csv-parser';
import { BlobServiceClient } from "@azure/storage-blob";
import { ServiceBusClient } from "@azure/service-bus";

const blobTrigger: AzureFunction = async function(context: Context, myBlob: any): Promise<void> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage || '');
    const containerClient = blobServiceClient.getContainerClient('uploaded');

    const serviceBusConnectionString = process.env.ServiceBusConnectionString;
    const queueName = "garegin_servicebus_queue";

    const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
    const sender = serviceBusClient.createSender(queueName);
    
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");

    const blockBlobClient = containerClient.getBlockBlobClient(context.bindingData.blobTrigger);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    const readableStream = downloadBlockBlobResponse.readableStreamBody;

    readableStream
        .pipe(csv())
        .on('data', row => {
            sender.sendMessages({body : JSON.stringify(row)});
        })
        .on('end', ()=> {
            sender.close();
            context.log('CSV Blob file reading completed.');
        });
};

export default blobTrigger;