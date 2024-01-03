import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../products";

const endpoint = process.env.ENDPOINT;

const key = process.env.COSMOS_KEY;

const databaseId = "products-db";
const containerIdProducts = "products";
const containerIdStocks = "stocks";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const productsContainer = database.container(containerIdProducts);

const productSample: Omit<Product, "id"> = {
  description: "",
  price: 0,
  title: "",
};

const validate = (obj: object) => {
  const arr = Object.keys(obj);

  if (arr.length !== 3) return false;

  for (const key of arr) {
    if (!(key in productSample)) return false;
  }

  return true;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(req)
  const isValid = validate(req.body);
  let id: string;
  if (isValid) {
    const { resource: createdProduct } = await productsContainer.items.create({
      ...req.body,
      id: uuidv4(),
    });
    id = createdProduct.id;
  }

  context.res = {
    status: isValid ? 200 : 400,
    body: isValid ? id : { errorMessage: "data is invalid" },
  };
};

export default httpTrigger;
