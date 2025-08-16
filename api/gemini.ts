import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DashboardData, Dimension } from '../types';

let ai: GoogleGenerativeAI | null = null;

const getAiClient = (providedApiKey?: string): GoogleGenerativeAI => {
    const apiKey = providedApiKey ||
                   import.meta.env.VITE_DASHBOARD_GEMINI_API_KEY ||
                   import.meta.env.VITE_GEMINI_API_KEY;
                   
    if (!apiKey) {
        throw new Error("Gemini API key is not provided. Set VITE_GEMINI_API_KEY or pass apiKey prop.");
    }
    if (!ai || (providedApiKey && providedApiKey !== ai.apiKey)) {
        ai = new GoogleGenerativeAI(apiKey);
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
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        const rawText = response.response.text();
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
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        return response.response.text();
    } catch (error) {
        console.error("Error calling Gemini API for summary:", error);
        return "Could not generate executive summary due to an API error. Please ensure the API key is correctly configured.";
    }
};
