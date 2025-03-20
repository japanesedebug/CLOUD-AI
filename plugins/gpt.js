import fetch from 'node-fetch';
import config from '../../config.cjs';

const gptCommand = async (message, client) => {
    const userMessage = message.body.trim();
    const triggerWords = ["gpt", "ai", "bera"]; // Non-prefix trigger words

    // Ensure the message starts with a trigger word and has a query
    const match = userMessage.match(/^(gpt|ai|bera)\s+(.+)/i);
    if (!match) return; // Ignore messages that don't match the pattern

    const query = match[2].trim();
    if (!query) {
        await client.sendMessage(message.from, { text: "⚠️ Please provide a prompt. Example: `gpt What is life?`" }, { quoted: message });
        return;
    }

    try {
        const response = await fetch(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok || !data.success || !data.result) {
            throw new Error("Invalid API response");
        }

        await client.sendMessage(message.from, { text: `🤖 *AI Response:*\n\n${data.result}` }, { quoted: message });
    } catch (error) {
        console.error("GPT Error:", error);
        await client.sendMessage(message.from, { text: "❌ Failed to fetch response. Try again later!" }, { quoted: message });
    }
};

export default gptCommand;
