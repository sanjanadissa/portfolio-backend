import cors from 'cors'
import express from "express"
import { POST } from "./chat/api.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.post("/api/chat",async(req,res)=>{
    try {
        const result = await POST({
            json: async () => req.body
        });
        console.log(result)
        const data = await result.json();
        res.json(data)

    } catch (err) {
        console.error(err);
        res.status(500).json({reply : "Server error"});
    }
})


app.listen(PORT, ()=>{
    console.log("Backend running on http://localhost:3001");
});