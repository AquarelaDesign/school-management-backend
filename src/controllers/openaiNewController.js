import axios from "axios";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { openai } from "../../server.js";

dotenv.config();

const openaiText = asyncHandler(async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    // const response = await openai.createChatCompletion({
    const response = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." }, // Isso representa o bot e que papel eles assumirão
          { role: "user", content: text }, // a mensagem que o usuário envia

          // BONUS NOTE: Você também pode fornecer uma lista de mensagens ao bot para dar contexto e o bot
          // pode usar essas informações para responder ao usuário conforme necessário, ou seja, adicionando:
          // { role: "assistant", content: "O tempo é péssimo hoje." },

          // para a matriz de mensagens acima e depois fazendo esta pergunta:
          // `Como está o tempo hoje?`

          // O bot me deu esta resposta:
          // `Peço desculpas pela minha resposta anterior. Como modelo de idioma da IA, eu não devo usar esse idioma.
          // Não tenho acesso a informações climáticas em tempo real sem sua localização. Você poderia me informar
          // sua localização, para que eu possa fornecer informações climáticas precisas?`

          // Portanto, se você quisesse manter os "threads" que existem no ChatGPT, teria que salvar as mensagens
          // que o bot envia e forneça-las ao bot na próxima solicitação.
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error.response.data.error);
    res.status(500).json({ error: error.message });
  }
});

const openaiCode = asyncHandler(async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Você é um codificador assistente que responde apenas com código e sem explicações.",
        }, // this represents the bot and what role they will assume
        { role: "user", content: text }, // the message that the user sends
      ],
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error.response.data.error);
    res.status(500).json({ error: error.message });
  }
});

const openaiAssist = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente útil que serve apenas para concluir os pensamentos ou frases do usuário.",
        }, // Isso representa o bot e que papel eles assumirão
        { role: "user", content: `Finish my thought: ${text}` }, // a mensagem que o usuário envia
      ],
    });

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export { openaiText, openaiCode, openaiAssist };
