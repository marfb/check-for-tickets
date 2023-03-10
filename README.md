# Check for tickets v1.3.1

The idea behind this project is to set an automated process to check if your event is available for sell in an specific tickets-sale platform. In case tickets are available you'll be noticed via SMS. Also the idea is to have it working as soon as possible, so there are a LOT of things that can and must (and maybe will) be done better and/or secure. You are warned and must use this project at your own risk without any responsibility of the contributors to the project.

## Pre-requisites

You must have a Twilio account for this app to work. If you don´t have one, at the _How to use it_ section you'll find a link to create one for free.
Also access to an slack app endpoint to receive others notifications.
This app is meant to run in your own old laptop with PM2 or just by executing the script in your terminal or any other similar way that may exist now or in the future.

## How to use it

1. Create your twilio account following instruction at this [link](https://www.twilio.com/try-twilio)
2. After creating your account edit `template.CONFIG.js` file with the data from your twilio account and your Slack app endpoint.
3. Rename `template.CONFIG.js` to `CONFIG.js`.
4. In terminal execute `npm run start`. Done.

## Type of messages

This is how and where the script will notify you for news:

| Trigger             | Channel       | Message                                                                    |
| ------------------- | ------------- | -------------------------------------------------------------------------- |
| Tickets available   | SMS and Slack | Entradas a la venta! `url of site`                                         |
| Markdown changes    | Slack         | No hay mas eventos o cambio el markup! `url of site`                       |
| Event count changes | Slack         | Cambio cantidad de eventos en: `url of site`. New count: `new event count` |

Have in mind that the script will send all of this notifications only once. If `event count` or `markdown` changes several times you'll get noticed only once for each trigger. In order to be notified again you'll have to stop de process adjust the count or the markup selector and restart the script.

## Version 1.3.1

At the moment this project is configured to search for tickets for Argentina - Panama match that will be available at autoentrada.com. In the future, configuration file will let you set:

- Ticket platform url
- Event name or keywords
- Phone numbers to be notified

## Dependencies

- Node.js
- Axios
- Cheerio
- Twilio
