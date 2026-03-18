import axios from "axios";

export async function queryVector(vector) {

    const res  = await axios.post(
        `${process.env.UPSTASH_VECTOR_REST_URL}/query`,
        {
            vector,
            topK: 5,
            includeMetadata: true,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`,
            },
        }

    );
    
    return res.data.result;

}

export async function upsertVector(id, vector, text){
    await axios.post(
         `${process.env.UPSTASH_VECTOR_REST_URL}/upsert`,
        [{ id, vector, metadata: { text } }],
        {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`
            },
        },
    );
    console.log("VECTOR URL:", process.env.UPSTASH_VECTOR_REST_URL);

}

