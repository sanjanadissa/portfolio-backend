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
    await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/lrange/chat:${sessionId}:recent/0/9`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}`
            },
            body: JSON.stringify(msg),
        }
    );
}