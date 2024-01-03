import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import productList, { Product } from "../products";
import { CosmosClient, ItemResponse } from "@azure/cosmos";

const endpoint = process.env.ENDPOINT;

const key = process.env.COSMOS_KEY;

const databaseId = "products-db";
const containerIdProducts = "products";
const containerIdStocks = "stocks";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const productsContainer = database.container(containerIdProducts);
const stocksContainer = database.container(containerIdStocks);

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(req)
  const { productId: id } = req.params;
  const { resource: product }: ItemResponse<Product> = await productsContainer
    .item(id, id)
    .read();
  const { resource: stock } = await stocksContainer.item(id, id).read();
  const productWithStocks = productList.find((product) => product.id === id);
  console.log(product);
  console.log(stock);
  context.res = {
    status: product ? 200 : 404,
    body: product
      ? {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          count: stock ? stock.count : 0,
        }
      : { error: "Product not found" },
  };
};

export default httpTrigger;
