export async function getRecent(sessionId){
   
    const res = await fetch(
         `${process.env.UPSTASH_REDIS_REST_URL}/lrange/chat:${sessionId}:recent/0/9`,
         {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}`
            },
        }

    );

    const data = await res.json();
    return data.result || [];
}

export async function pushRecent(sessionId, msg) {
    console.log("PUSHING TO REDIS:", msg);

    const res = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/rpush/chat:${sessionId}:recent`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(msg),
        }
    );

    const data = await res.json(); // ✅ now res exists
    console.log("REDIS RESPONSE:", data);
}