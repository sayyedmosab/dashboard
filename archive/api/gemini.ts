import { GoogleGenAI } from "@google/genai";
import type { DashboardData, Dimension } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (providedApiKey?: string): GoogleGenAI => {
    // Use provided API key or fallback to environment variable
    const apiKey = providedApiKey || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
        throw new Error("API_KEY_MISSING: No Gemini API key provided. Set VITE_GEMINI_API_KEY in .env.local or pass a key to the function");
    }
    
    // Don't reuse client if new API key is provided
    if (providedApiKey || !ai) {
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

const formatResponse = (text: string): string => {
    // Use inline styles with CSS variables to ensure theming works
    return text
        .replace(/Risks|Challenges/gi, '<h4 style="color: var(--component-color-danger);">$&</h4>')
        .replace(/Opportunities|Recommendations/gi, '<h4 style="color: var(--component-color-success);">$&</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\s*\*/gm, '<li>')
        .replace(/$/gm, '</li>')
        .replace(/<\/li>\n<li>/g, '</li><li>')
        .replace(/<\/li>(\s*<h4)/g, '</li></ul>$1')
        .replace(/(<h4>.*?<\/h4>)/g, '$1<ul>') + '</ul>';
};

export const fetchInsightAnalysis = async (insightData: any, apiKey?: string): Promise<string> => {
    const prompt = `
        As a senior government sector strategist, analyze the following JSON data for the "${insightData.title}" module of our transformation dashboard.
        Data: ${JSON.stringify(insightData, null, 2)}

        Provide a brief, insightful analysis. Identify the top 2-3 potential risks or challenges revealed by this data. Then, identify the top 2-3 strategic opportunities or recommendations. 
        
        Format your response in Markdown with clear "**Risks**" and "**Opportunities**" sections, using bullet points (*).
    `;

    try {
        const client = getAiClient(apiKey);
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const rawText = response.text;
        return formatResponse(rawText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `<p>Failed to generate the analysis due to an API error. Please ensure the API key is correctly configured.</p>`;
    }
};

export const fetchExecutiveSummary = async (dimensions: Dimension[], apiKey?: string): Promise<string> => {
    const prompt = `
        As a Chief Strategy Officer, review the following holistic transformation dashboard data.
        Data: ${JSON.stringify(dimensions, null, 2)}

        Provide a concise, executive-level summary of the overall transformation health. Highlight the most significant strengths and the most pressing area of concern. The tone should be objective and direct. Do not use markdown formatting.
    `;
    
    try {
        const client = getAiClient(apiKey);
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for summary:", error);
        return "Could not generate executive summary due to an API error. Please ensure the API key is correctly configured.";
    }
};
