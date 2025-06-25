import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
import productRoutes from "./routes/productRoutes.js"
import path from "path"

import { sql } from "./config/db.js";
import { aj } from './lib/arcjet.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
})); // helmet is a security middleware that helps you protect your app by setting various HTTP protocol
app.use(morgan("dev")); // log the request

// apply arcjet rate limit to all routes

app.use(async (req , res , next) => {

    try {
        const decision = await aj.protect(req, {
            requested:1
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too Many Requests"});
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot access denied" })
            } else {
                res.status(403).json({ error: "Forbidden" })
            }
            return
        }
        
        //check for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed bot detected" });
        }
        next()
    } catch (error) {
        console.log("Arcjet error", error )
    }

});

app.use("/api/products", productRoutes);

if(process.env.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname,"/client/dist")))

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client","dist","index.html"));
    })
}

async function initDB() {
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        console.log("DB connected!!");
    } catch(error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
app.listen(PORT , () => {
    console.log("Server is running on port " + PORT);''
})
});