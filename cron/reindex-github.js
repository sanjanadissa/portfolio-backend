import axios from "axios";
import { generateEmbedding } from "../lib/embeddings";
import { upsertVector } from "..//lib/vector";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response("Unauthorized", { status: 401 });
        }

        const username = process.env.GITHUB_USERNAME;

        const repos = await axios.get(
            `https://api.github.com/users/${username}/repos`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                },
            }
        );

        for (const repo of repos.data) {
             const content = `
                Repo: ${repo.name}
                Description: ${repo.description}
                Topics: ${repo.topics?.join(", ")}
                Language: ${repo.language}
                Stars: ${repo.stargazers_count}
                Forks: ${repo.forks_count}
                Created: ${repo.created_at}
                Updated: ${repo.updated_at}
                URL: ${repo.html_url}
                README:${readmeContent}
                `;

            const embedding = await generateEmbedding(content);

            await upsertVector(`repo-${repo.id}`, embedding, content);
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error(error);
        return new Response("Error reindexing GitHub", { status: 500 });
    }
}
