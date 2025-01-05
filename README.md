# CsInvestmentsTracker

### Setup

create .env in /backend\
add the following to .env:\
STEAMMARKETAPIKEY={api key from https://steamapis.com/} \
STEAMAPIKEY={api key from https://steamcommunity.com/dev/apikey} \
SESSIONSECRET={random key} \
BACKENDURL=http://localhost:3000/ \
FRONTENDURL=http://localhost:4200/ \

Install node packages and run database setup:
```
/$ sudo npm install -g @angular/cli
/$ sudo npm install
/backend$ sudo npm install
/backend$ node setup_db.mjs
```

Run the frontend and backend scripts to host the site locally:
```
/backend$ node app.mjs
/$ ng serve
```