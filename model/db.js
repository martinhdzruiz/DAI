// model/db.js
import mongoose from "mongoose"

const USER = process.env.USER_DB || "root"
const PASS = process.env.PASS || "example"
const DB = process.env.DB_NAME || "DAI"
const HOST = process.env.DB_HOST || "localhost" // si ejecutas fuera de Docker

const uri = `mongodb://${USER}:${PASS}@${HOST}:27017/${DB}?authSource=admin`

export default async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("✅ Conectado a MongoDB:", uri)
    } catch (err) {
        console.error("❌ Error al conectar a Mongo:", err.message)
        process.exit(1)
    }
}
