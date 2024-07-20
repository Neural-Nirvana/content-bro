import { ChatOpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { imageGenTool } from "../tools/imageGenTool";

class ImageGeneratorAgent {
  constructor() {
    this.chatModel = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.promptTemplate = new PromptTemplate({
      template: "Create a less than 100 word prompt to generate an image for social media post based on the following requirements: {requirements}",
      inputVariables: ["requirements"],
    });

    this.chain = new LLMChain({
      llm: this.chatModel,
      prompt: this.promptTemplate,
    });
  }

  async generateImage(requirements) {
    try {
      console.log("Generating image with requirements:", requirements);
      const { text: imageDescription } = await this.chain.call({ requirements });
      const imageUrl = await imageGenTool.call(imageDescription);
      return { imageUrl, imageDescription };
    } catch (error) {
      console.error("Error in image generation:", error);
      throw error;
    }
  }
}

export const imageGeneratorAgent = new ImageGeneratorAgent();