import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { CosmosClient } from "@azure/cosmos";

const endpoint = "<YOUR_ENDPOINT>";
const key = "<YOUR_COSMOS_KEY>";

const databaseId = "products-db";
const containerIdProducts = "products";
const containerIdStocks = "stocks";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const productsContainer = database.container(containerIdProducts);
const stocksContainer = database.container(containerIdStocks);

async function main() {
  for (let i = 0; i < 20; i++) {
    // Generate random data for products and stock
    const id = uuidv4();
    const title = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price();
    const count = faker.string.numeric({ length: { min: 1, max: 2 } });

    // Product and Stock item structure
    const productItem = { id, title, description, price };
    const stockItem = { id, product_id: id, count };

    // Add product
    const { resource: createdProduct } = await productsContainer.items.create(
      productItem
    );
    console.log(`Created product: ${createdProduct.id}`);

    // Add stock
    const { resource: createdStock } = await stocksContainer.items.create(
      stockItem
    );
    console.log(`Created stock: ${createdStock.product_id}`);
  }
}

main().catch((error) => {
  console.error(error);
});
