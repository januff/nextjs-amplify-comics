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
      name: "Mo Farooq",
      username: "mofarooq32",
      avatar: "https://i.imgur.com/9KYq7VG.png",
      is_followed: true,
      video: "https://i.imgur.com/FTBP02Y.mp4",
      caption: "These ducks are MEGA cute",
      likes: 10,
      comments: 2,
      timestamp: "2019-03-10T09:08:31.020Z",
      button_visible: true,
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


