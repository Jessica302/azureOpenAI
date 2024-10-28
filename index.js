const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const LINE_ACCESS_TOKEN =
  "kWVKO7sNk3vSGDtkvP9RaTlXx/3S4ZWdWrVa32NTPBF8w0tgClC9kEEGORVGbEXu2pDuX0IAeMfjOl12ZyZ93Cdn1zwtB0ohQ7X8UPLUhUrnXqwuKf1vtdQ537EFfdkuW4H7E0Z/OeOcIaiQaDsMBQdB04t89/1O/w1cDnyilFU=";
const AZURE_OPENAI_KEY = "2c53f5e1814e4270a3e24d7414c8a3f1";
const AZURE_OPENAI_ENDPOINT =
  "https://edenkao-api.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2023-03-15-preview";

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.events[0].message.text;

  try {
    const response = await axios.post(`${AZURE_OPENAI_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${AZURE_OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      data: { prompt: userMessage },
    });

    const reply = response.data.choices[0].text;
    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken: req.body.events[0].replyToken,
        messages: [{ type: "text", text: reply }],
      },
      { headers: { Authorization: `Bearer ${LINE_ACCESS_TOKEN}` } }
    );
  } catch (error) {
    console.error(error);
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot running on port 3000"));
