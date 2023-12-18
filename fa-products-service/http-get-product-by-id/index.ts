import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import productList from "../products";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {

  const { productId } = req.params;
  const product = productList.find((product) => product.id === productId);

  context.res = {
    status: product ? 200 : 404,
    body: product ? product : { error: "Product not found" },
  };
};

export default httpTrigger;
