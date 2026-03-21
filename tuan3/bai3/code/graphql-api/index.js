const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// 1. Define Schema (Cấu trúc dữ liệu)
const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String
    price: Float
    description: String
    inStock: Boolean
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`;

// 2. Data giả lập
const products = [
  { id: '1', name: 'Laptop Gaming', price: 1500, description: "Powerful laptop", inStock: true },
  { id: '2', name: 'Wireless Mouse', price: 50, description: "Ergonomic mouse", inStock: false },
];

// 3. Define Resolvers (Hàm xử lý logic lấy data)
const resolvers = {
  Query: {
    products: () => products,
    product: (parent, args) => products.find(p => p.id === args.id),
  },
};

// 4. Start Server
async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });

    console.log(`🚀 GraphQL Server ready at: ${url}`);
    console.log(`Try querying: query { product(id: "1") { name price } }`);
}

startServer();
