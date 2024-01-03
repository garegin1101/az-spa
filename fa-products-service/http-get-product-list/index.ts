import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import type { Product } from "../products";

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
  const products = await productsContainer.items.readAll().fetchAll();
  const stocks = await stocksContainer.items.readAll().fetchAll();

  const productWithStocks = products.resources.map((product: Product) => {
    const productStock = stocks.resources.find(
      (stock) => stock.product_id === product.id
    );

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      count: productStock ? productStock.count : 0,
    };
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: productWithStocks,
  };
};

export default httpTrigger;
