import axios from "axios";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { openai } from "../../server.js";

dotenv.config();

const openaiText = asyncHandler(async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].text },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

const openaiCode = asyncHandler(async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await openai.createCompletion({
      model: "code-davinci-002",
      prompt: text,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].text },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error("error", error.response.data.error);
    res.status(500).json({ error: error.message });
  }
});

const openaiAssist = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Finish my thought: ${text}`,
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export { openaiText, openaiCode, openaiAssist };
