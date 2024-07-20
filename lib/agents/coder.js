import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { htmlCssGenTool } from "../tools/htmlGenTool";
import { LLMChain } from "langchain/chains";

class CodingAgent {
  constructor() {
    this.chatModel = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.promptTemplate = new PromptTemplate({
      template: `Generate style guidelines for a poster with the following content:
      {content}
      
      Provide the style guidelines in a concise format, including color scheme, font choices, and layout suggestions.`,
      inputVariables: ["content"],
    });

    this.chain = new LLMChain({
      llm: this.chatModel,
      prompt: this.promptTemplate,
    });
  }

  async generateCode(content) {
    try {
      const { text: styleGuidelines } = await this.chain.call({ content });
      const input = JSON.stringify({ content, styleGuidelines });
      const result = await htmlCssGenTool.call(input);
      return JSON.parse(result);
    } catch (error) {
      console.error("Error in code generation:", error);
      throw error;
    }
  }
}

export const codingAgent = new CodingAgent();