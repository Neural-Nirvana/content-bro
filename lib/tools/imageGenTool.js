import { Tool } from "langchain/tools";
import { OpenAI } from "openai";

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
      console.log("input", input)
      const response = await this.openai.images.generate({
        prompt: input,
        n: 1,
        size: "1024x1024",
      });

      console.log("OpenAI API response:", JSON.stringify(response.data, null, 2));
      console.log("response.data", response.data[0].url)

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error("No image URL in the API response");
      }

      return imageUrl;
    } catch (error) {
      console.error("Error in image generation:", error);
      if (error.response) {
        console.error("OpenAI API error response:", error.response.data);
      }
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

export const imageGenTool = new ImageGenerationTool();