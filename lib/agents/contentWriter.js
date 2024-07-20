import { ChatOpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

class ContentWriterAgent {
  constructor() {
    this.chatModel = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.promptTemplate = new PromptTemplate({
      template: `Create engaging content for a poster based on the following requirements:
      Requirements: {requirements}
      
      Provide the content in the following format:
      Title:
      Subtitle:
      Main points:
      Call to action:`,
      inputVariables: ["requirements"],
    });

    this.chain = new LLMChain({
      llm: this.chatModel,
      prompt: this.promptTemplate,
    });
  }

  async generateContent(requirements) {
    try {
      const { text: content } = await this.chain.call({ requirements });
      return content;
    } catch (error) {
      console.error("Error in content generation:", error);
      throw error;
    }
  }
}

export const contentWriterAgent = new ContentWriterAgent();