const cheerio = require("cheerio");
const axios = require("axios");
const constants = require("./CONFIG");
const { ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, TO_NUMBER } = constants;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

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

  let notify = false;

  eventCards.each((_, event) => {
    const eventTitle = $(event).text();

    if (eventTitle.includes("anam")) {
      notify = true;
    }
  });

  if (notify) {
    client.messages
      .create({
        body: "Entradas a la venta!",
        from: `${FROM_NUMBER}`,
        to: `${TO_NUMBER}`,
      })
      .then((message) => console.log(message.sid));
  }
};

performScraping();
