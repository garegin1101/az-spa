import { AzureFunction, Context } from "@azure/functions"

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);

    context.log('Service Bus message received: ', mySbMsg);
    
    // access the body of the message
    let productData = mySbMsg.body; 

    // assuming body is a JSON string - parse it into an object
    let product = JSON.parse(productData);

    // then you can put product in Cosmos DB 
    context.bindings.outputDocument = product;
};

export default serviceBusQueueTrigger;
