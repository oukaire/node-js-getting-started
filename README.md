# Assignment3:landmarkz, a server for Assignment2:landmarks
-------------------------------------------------------------------------
by Onyi Ukay
Last Updated: November 17, 2017
-------------------------------------------------------------------------

A Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

# Implemented:
All components of assignment have been implemented. Components include:
'index.js' main web app server with the routes: 
  * POST '/sendLocation' - requires
        - login (a string)
        - Two floats lat and lng
  * GETs '/' - renders homepage
  * ' and '/checkins.json' - requires a query string with a login
'readFromDatabase.js' exports a single function that reads from Mongodb servers.
It was implemented to practice how to split server files across multiple documents.
'home.ejs' incorporates javascript function into home page
'home.css' style sheet for home page

# Hours spent on Learning, Designing & Implementing
15 hours

# Credits

A **Shout-Out** to Toby Glover for affording me a tutorial on ejs. 
Also found out about his comp20 project: [Wikilinks](http://wikilinks.io/) - check it out! 

The Documentations at:
- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Validator Software](https://github.com/chriso/validator.js)
- [Mongo Database](https://github.com/mongodb/node-mongodb-native)
- [BodyParser](https://github.com/expressjs/body-parser)
- [Ming's nodemongoapp](https://github.com/tuftsdev/WebProgramming/blob/gh-pages/examples/nodejs/nodemongoapp/server.js)
