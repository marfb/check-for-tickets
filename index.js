const cheerio = require("cheerio");
const axios = require("axios");
const constants = require("./CONFIG");
const { ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, TO_NUMBER, SLACK_APP_URL } =
  constants;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

let markupChanged = false;
let eventCountChanged = false;
let ticketsAvailable = false;
let timesExecuted = 0;

const sites = [
  {
    site: "deportik",
    url: "https://www.deportick.com/",
    selector: ".home-events .event-thumb > a",
    count: 8,
  },
  {
    site: "autoentrada/deporte",
    url: "https://ventas.autoentrada.com/t/deporte",
    selector: ".container.marketing div.evento > a",
    count: 0,
  },
  {
    site: "autoentrada",
    url: "https://ventas.autoentrada.com/",
    selector: ".container.marketing div.evento > a",
    count: 43,
  },
];

const performScraping = async ({ url, selector, count }) => {
  const axiosResponse = await axios.request({
    method: "GET",
    url: url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(axiosResponse.data);
  const eventCards = $(selector);

  timesExecuted += 1;
  if (ticketsAvailable) {
    console.log("Process stopped - tickets available");
    clearInterval(process);
  }

  if (eventCards.length < 1 && !markupChanged) {
    await axios
      .post(SLACK_APP_URL, {
        text: `No hay mas eventos o cambio el markup! ${url}`,
      })
      .then(() => {
        markupChanged = true;
      })
      .catch((e) => {
        console.log("post error ->", e);
      })
      .finally(() => {
        markupChanged = true;
      });
  }

  let notify = false;

  eventCards.each((_, event) => {
    const { href = "" } = $(event)[0].attribs;

    if (href.includes("anam")) {
      notify = true;
    }
  });

  if (notify && !ticketsAvailable) {
    await client.messages
      .create({
        body: `Entradas a la venta! ${url}`,
        from: `${FROM_NUMBER}`,
        to: `${TO_NUMBER}`,
      })
      .then((message) => {
        ticketsAvailable = true;
        console.log(message.sid);
      });
    await axios
      .post(SLACK_APP_URL, {
        text: `Entradas a la venta! ${url}`,
      })
      .then(() => {
        ticketsAvailable = true;
      })
      .catch((e) => {
        console.log("post error ->", e);
      })
      .finally(() => {
        ticketsAvailable = true;
      });
  }

  if (eventCards.length !== count && !eventCountChanged) {
    await axios
      .post(SLACK_APP_URL, {
        text: `Cambio cantidad de eventos en: ${url}. New count: ${eventCards.length}`,
      })
      .then(() => {
        eventCountChanged = true;
      })
      .catch((e) => {
        console.log("post error ->", e);
      })
      .finally(() => {
        eventCountChanged = true;
      });
  }
};

const process = setInterval(() => {
  sites.forEach((siteData) => {
    performScraping(siteData).then(() => {
      const now = Date.now();
      console.log(
        `        ******
        Scrapper executed ${timesExecuted} times.
        Last at ${new Date(now)}
        Url: ${siteData.site}
        ******
        `
      );
    });
  });
}, 10000);
