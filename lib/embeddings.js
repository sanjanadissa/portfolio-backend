import axios from 'axios'


const MODEL = "sentence-transformers/all-MiniLM-L6-v2";


export async function generateEmbedding(text) {

     const res = await axios.post(
        `https://router.huggingface.co/hf-inference/models/${MODEL}/pipeline/feature-extraction`,
        { inputs: text },
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    return res.data;
    
}