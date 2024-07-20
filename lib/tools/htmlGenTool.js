import { Tool } from "langchain/tools";
import { ChatOpenAI } from "@langchain/openai";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

class HTMLCSSGenerationTool extends Tool {
  name = "HTML and CSS Generation";
  description = "Useful for generating HTML and CSS code for posters based on content and style guidelines.";

  constructor() {
    super();
    this.chatModel = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4", // or "gpt-3.5-turbo" based on your requirements
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async _call(input) {
    try {
      const { content, styleGuidelines } = JSON.parse(input);

      const messages = [
        new SystemMessage(
          "You are a skilled web developer tasked with creating HTML and CSS for a poster. Generate clean, responsive code that works well on various screen sizes."
        ),
        new HumanMessage(
          `Create HTML and CSS for a poster with the following content:
          ${content}
          
          Style guidelines:
          ${styleGuidelines}
          
          Please provide the HTML and CSS in separate code blocks.`
        ),
      ];

      const response = await this.chatModel.call(messages);

      // Extract HTML and CSS from the response
      const htmlMatch = response.text.match(/```html\n([\s\S]*?)\n```/);
      const cssMatch = response.text.match(/```css\n([\s\S]*?)\n```/);

      const html = htmlMatch ? htmlMatch[1] : "";
      const css = cssMatch ? cssMatch[1] : "";

      return JSON.stringify({ html, css });
    } catch (error) {
      console.error("Error generating HTML and CSS:", error);
      return "Error generating HTML and CSS. Please try again with different content or style guidelines.";
    }
  }
}

export const htmlCssGenTool = new HTMLCSSGenerationTool();