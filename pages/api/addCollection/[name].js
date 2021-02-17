// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Dynamic API routes https://nextjs.org/docs/api-routes/dynamic-api-routes

const { createClient } = require("@astrajs/collections")

export default async (req, res) => {
  const {query: { name }} = req

  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    username: process.env.ASTRA_DB_USERNAME,
    password: process.env.ASTRA_DB_PASSWORD,
  })

  const collection = astraClient
    .namespace(process.env.ASTRA_DB_KEYSPACE)
    .collection(name);

  res.statusCode = 200
  res.json(collection);
}
