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
  
  const data = [
    {
      id: 0,
      name: "Netlify",
      url: "netlify.com"
    },
    {
      id: 1,
      name: "Vercel",
      url: "nextjs.org"
    },
  ]
  
  const collection = astraClient
    .namespace(process.env.ASTRA_DB_KEYSPACE)
    .collection(name)

  for (let i = 0; i < data.length; i++) {
    await collection.create(data[i].id.toString(), data[i])
  }

  res.statusCode = 200
  res.json(collection);
}


