import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import productList from "../products";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: productList
    };
};

export default httpTrigger;