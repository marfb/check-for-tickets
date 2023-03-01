# Check for tickets v1.0.0

The idea behind this project is to set an automated process to check if your event is available for sell in an specific tickets-sale platform. In case tickets are available you'll be noticed via SMS. Also the idea is to have it working as soon as possible, so there are a LOT of things that can and must (and maybe will) be done better and/or secure. You are warned and must use this project at your own risk without any responsibility of the contributors to the project.

## Pre-requisites

You must have a Twilio account for this app to work. If you don´t have one, at the _How to use it_ section you'll find a link to create one for free.
You'll need access to a SMTP server in order to be notified in case the element you are looking for appears no more. This is to alert you and check if the markup of the scrapped page has changed.
Also this app is meant to run in your own old laptop with PM2 or just by executing the script in your terminal or any other similar way that may exist now or in the future.

## How to use it

1. Create your twilio account following instruction at this [link](https://www.twilio.com/try-twilio)
2. After creating your account edit `template.CONFIG.js` file with the data from your twilio account and your SMTP host.
3. Rename `template.CONFIG.js` to `CONFIG.js`.
4. In terminal execute `npm run start`. Done.

## Version 1.0.0

At the moment this project is configured to search for tickets for Argentina - Panama match that will be available at autoentrada.com. In the future, configuration file will let you set:

- Ticket platform url
- Event name or keywords
- Phone numbers to be notified

## Dependencies

- Node.js
- Axios
- Cheerio
- Twilio
