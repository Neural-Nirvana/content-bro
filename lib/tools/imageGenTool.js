import { Tool } from "langchain/tools";
import { Configuration, OpenAI } from "openai";

class ImageGenerationTool extends Tool {
  name = "Image Generation";
  description = "Useful for generating images based on text descriptions. Input should be a detailed description of the image you want to generate.";

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    });
  }

  async _call(input) {
    try {
      const response = await this.openai.images.generate({
        prompt: input,
        n: 1,
        size: "1024x1024",
      });

      return response.data.data[0].url;
    } catch (error) {
      console.error("Error generating image:", error);
      return "Error generating image. Please try again with a different description.";
    }
  }
}

export const imageGenTool = new ImageGenerationTool();