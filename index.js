const cheerio = require("cheerio");
const axios = require("axios");
const constants = require("./CONFIG");
const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  FROM_NUMBER,
  TO_NUMBER,
  MAIL,
  SMTP_PORT,
  SMTP_HOST,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = constants;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);
const nodemailer = require("nodemailer");

let mailSent = false;
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
  if (mailSent || smsSent) {
    console.log("process done");
    clearInterval(process);
  }

  if (eventCards.length < 1 && !mailSent) {
    const transporter = nodemailer.createTransport({
      sendmail: true,
      port: SMTP_PORT,
      host: SMTP_HOST,
      secure: true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
    transporter.sendMail(
      {
        from: MAIL_FROM,
        to: `${MAIL}`,
        subject: "No hay eventos en AUTOENTRADA",
        text: "Este mensaje es para avisarte que no hay eventos en autoentrada. Puede deberse a que no hay más eventos disponibles o a que el selector para encontrar los eventos haya cambiado.",
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }
        mailSent = true;
      }
    );
  }

  let notify = false;

  eventCards.each((_, event) => {
    const eventTitle = $(event).text();

    if (eventTitle.includes("anam")) {
      notify = true;
    }
  });

  if (notify && !smsSent) {
    client.messages
      .create({
        body: "Entradas a la venta!",
        from: `${FROM_NUMBER}`,
        to: `${TO_NUMBER}`,
      })
      .then((message) => {
        smsSent = true;
        console.log(message.sid);
      });
  }
};

const process = setInterval(
  () => performScraping().then(console.log(`executed ${timesExecuted} times`)),
  10000
);
