import axios from "axios";
import { generateEmbedding } from "../lib/embeddings.js";
import { upsertVector } from "../lib/vector.js";
import dotenv from "dotenv";


dotenv.config({ path: "../.env" });

const username = process.env.GITHUB_USERNAME;
console.log(username)
const repos = await axios.get(
    `https://api.github.com/users/${username}/repos`,
    {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
    }
)



for (const repo of repos.data) {

    let readmeContent = "";

    try {
        const readmeRes = await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/readme`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3.raw"
                }
            }
        );

        readmeContent = readmeRes.data;
    } catch (err) {
        readmeContent = "No README available";
    }

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
    README: ${readmeContent}
    `;

    const embedding = await generateEmbedding(content);
    await upsertVector(`repo-${repo.id}`, embedding, content);
}

console.log("Github indexed successfully");