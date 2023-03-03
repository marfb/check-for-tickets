const cheerio = require("cheerio");
const axios = require("axios");
const constants = require("./CONFIG");
const { ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, TO_NUMBER, SLACK_APP_URL } =
  constants;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

let notifSent = false;
let smsSent = false;
let timesExecuted = 1;

const performScraping = async () => {
  const axiosResponse = await axios.request({
    method: "GET",
    url: "https://ventas.autoentrada.com/t/deporte",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(axiosResponse.data);
  const eventCards = $(".container.marketing div.evento a h2");

  timesExecuted += 1;
  if (smsSent) {
    console.log("process done");
    clearInterval(process);
  }

  if (eventCards.length < 1 && !notifSent) {
    await axios
      .post(SLACK_APP_URL, {
        text: "No hay mas eventos deportivos o cambio el markup!",
      })
      .then(() => {
        notifSent = true;
      })
      .catch((e) => {
        console.log("post error ->", e);
      })
      .finally(() => {
        notifSent = true;
      });
  }

  let notify = false;

  eventCards.each((_, event) => {
    const eventTitle = $(event).text();

    if (eventTitle.includes("anam")) {
      notify = true;
    }
  });

  if (notify && !smsSent) {
    await client.messages
      .create({
        body: "Entradas a la venta!",
        from: `${FROM_NUMBER}`,
        to: `${TO_NUMBER}`,
      })
      .then((message) => {
        smsSent = true;
        console.log(message.sid);
      });
    await axios
      .post(
        "https://hooks.slack.com/services/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",
        {
          text: "Ya están las entradas!!!",
        }
      )
      .then(() => {
        notifSent = true;
      })
      .catch((e) => {
        console.log("post error ->", e);
      })
      .finally(() => {
        notifSent = true;
      });
  }
};

const process = setInterval(
  () => performScraping().then(console.log(`executed ${timesExecuted} times`)),
  10000
);
