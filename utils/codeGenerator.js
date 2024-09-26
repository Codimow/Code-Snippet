const { GoogleGenerativeAI } = require('@google/generative-ai');
const NodeCache = require('node-cache');

const snippetCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Predefined snippets for instant responses
const predefinedSnippets = {
    'javascript-beginner': 'console.log("Hello, World!");',
    'python-beginner': 'print("Hello, World!")',
    'java-beginner': 'System.out.println("Hello, World!");',
    // Add more predefined snippets for common language-difficulty combinations
};

async function generateCodeSnippet(language, difficulty, topic) {
    const cacheKey = `${language}-${difficulty}-${topic}`;
    const cachedSnippet = snippetCache.get(cacheKey);
    if (cachedSnippet) {
        console.log('Returning cached snippet');
        return cachedSnippet;
    }

    const prompt = `Generate a concise ${difficulty} difficulty ${language} code snippet about ${topic}. Maximum 5 lines of code. No comments or explanations.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await Promise.race([
            model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 100,
                },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);

        const snippet = result.response.text().trim();
        
        snippetCache.set(cacheKey, snippet);
        return snippet;
    } catch (error) {
        console.error("Error in generateCodeSnippet:", error);
        return `// Error generating ${language} snippet for ${topic}\n// Please try again`;
    }
}

module.exports = { generateCodeSnippet };
