# CsInvestmentsTracker

### About

This project is meant to be a database that keeps track of purchases for in-game items for the game Counter Strike\
The Steam market allows users to buy and sell these items, and since the prices have risen steadily overtime, some users buy and hold items with the goal of making a profit selling later\
The goal of this project is to make it easier for users to keep track of their expenses and profits when "investing" in these in-game items\
Users can:
- Log in via their Steam account
- Search from every item avaliable on the Steam market and see the price for each item
- Navigate to an item page and view information about the item
- Create buy and sell transactions
- Automatically calculate statistics to keep track of the user's expenses and all time profits

### Presentation

https://youtu.be/aoy_-nvAlN4

### Setup

create .env in /backend\
add the following to .env:\
STEAMMARKETAPIKEY={api key from https://steamapis.com/}\
STEAMAPIKEY={api key from https://steamcommunity.com/dev/apikey}\
SESSIONSECRET={random key}\

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