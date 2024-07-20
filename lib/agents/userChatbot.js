import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { imageGenTool } from "../tools/imageGenTool";
import { htmlCssGenTool } from "../tools/htmlGenTool";
import { imageGeneratorAgent } from "./imageGenerator";
import { contentWriterAgent } from "./contentWriter";
import { codingAgent } from "./coder";

class UserChatbotAgent {
  constructor() {
    this.chatModel = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.memory = new BufferMemory();

    const template = `You are a helpful assistant guiding users in creating posters. 
    Your goal is to understand the user's requirements and help them create a great poster.
    Ask questions to gather necessary information about the poster's purpose, target audience, key messages, and design preferences.
    Once you have gathered sufficient information, inform the user that you're ready to create the poster.
    
    Current conversation:
    {history}
    Human: {input}
    AI: `;

    this.prompt = PromptTemplate.fromTemplate(template);

    this.chain = new ConversationChain({
      llm: this.chatModel,
      memory: this.memory,
      prompt: this.prompt,
    });

    this.requirementsAnalysisPrompt = PromptTemplate.fromTemplate(`
      Analyze the following conversation and determine if we have gathered enough information to create a poster.
      If we have enough information, summarize the poster requirements. If not, explain what additional information is needed.

      Conversation:
      {conversation}

      Provide your analysis in the following format:
      Ready to create poster: [YES/NO]
      Requirements summary: [If ready, summarize the requirements here]
      Additional information needed: [If not ready, list the information we still need]
    `);

    this.requirementsAnalysisChain = new LLMChain({
      llm: this.chatModel,
      prompt: this.requirementsAnalysisPrompt,
    });
  }

  async chat(input) {
    const response = await this.chain.call({ input });
    const analysisResult = await this.analyzeRequirements();
    
    if (analysisResult.readyToCreate) {
      return {
        response: response.response + "\n\nI think I have gathered enough information to create your poster. Would you like me to generate it now?",
        readyToCreate: true,
        requirements: analysisResult.requirements
      };
    } else {
      return {
        response: response.response,
        readyToCreate: false
      };
    }
  }

  async analyzeRequirements() {
    const conversation = await this.memory.loadMemoryVariables({});
    const analysis = await this.requirementsAnalysisChain.call({ conversation: conversation.history });
    
    const readyToCreate = analysis.text.includes("Ready to create poster: YES");
    const requirements = analysis.text.match(/Requirements summary: (.*)/)?.[1] || "";
    
    return { readyToCreate, requirements };
  }

  async createPoster(requirements) {
    try {
      const [content, imageResult, codeResult] = await Promise.all([
        contentWriterAgent.generateContent(requirements),
        imageGeneratorAgent.generateImage(requirements),
        codingAgent.generateCode(requirements)
      ]);

      const { imageUrl, imageDescription } = imageResult;
      const { html, css } = codeResult;

      return {
        content,
        imageUrl,
        imageDescription,
        html,
        css,
      };
    } catch (error) {
      console.error("Error in poster creation:", error);
      throw error;
    }
  }
}

export const userChatbot = new UserChatbotAgent();