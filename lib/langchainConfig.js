import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";

// Initialize the OpenAI model
export const model = new OpenAI({
  temperature: 0.7,
  modelName: "gpt-4", // or "gpt-3.5-turbo" based on your requirements
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize the ChatOpenAI model
export const chatModel = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4", // or "gpt-3.5-turbo" based on your requirements
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create a conversation chain with memory
export const conversationChain = new ConversationChain({
  llm: chatModel,
  memory: new BufferMemory(),
});

// Create prompt templates for different tasks

// User Chatbot prompt
export const userChatbotPrompt = new PromptTemplate({
  template: "You are a helpful assistant guiding users in creating posters. The user says: {userInput}. Provide a helpful response to guide them in creating their poster.",
  inputVariables: ["userInput"],
});

// Content Writer prompt
export const contentWriterPrompt = new PromptTemplate({
  template: "Create engaging content for a poster with the following details:\nTitle: {title}\nSubtitle: {subtitle}\nMain points: {mainPoints}\nStyle: {style}",
  inputVariables: ["title", "subtitle", "mainPoints", "style"],
});

// HTML/CSS Generator prompt
export const htmlCssGeneratorPrompt = new PromptTemplate({
  template: "Generate HTML and CSS for a poster with the following content:\n{content}\nStyle guidelines: {styleGuidelines}",
  inputVariables: ["content", "styleGuidelines"],
});

// Function to get the API key (you might want to implement this differently based on your setup)
export const getApiKey = () => process.env.OPENAI_API_KEY;

// Function to set the API key
export const setApiKey = (apiKey) => {
  process.env.OPENAI_API_KEY = apiKey;
  model.openAIApiKey = apiKey;
  chatModel.openAIApiKey = apiKey;
};

// Function to change the model
export const setModel = (modelName) => {
  model.modelName = modelName;
  chatModel.modelName = modelName;
};