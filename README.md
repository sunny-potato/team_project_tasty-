# Installing and running Tasty App

### Includes

- Automatic refresh on save
- External API communication powered by Spoonacular
- SQL request to NTNU database (Need to be connected via VPN to NTNU for it to work)

#### VPN
If you are not connected to NTNU at campus, then press the link for a guide on how to
set up a VPN connection to NTNU here https://i.ntnu.no/wiki/-/wiki/English/Install+VPN.

## Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'sondest_gruppe5_dev';
process.env.REACT_API_KEY = 'Top-secret-key-here';
```
If you do not have an API key to spoonacular, press the link and create an account here https://spoonacular.com/food-api/console#.
After confirming you account with your email and logging in, press `profile`, then press `Show / Hide API Key`,
and then copy paste the API key into `Top-secret-key-here` inside the `server/config.ts` file.

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'sondest_gruppe5_test';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Run server tests:

```sh
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

### Run client tests:

```sh
npm test
```
