# Northcoders News API

## Summary

This application is an Express API that provides access to a PostgreSQL news database containing various articles with all their attributes and their associated authors and comments. Articles can be filtered by topic and ordered by any property.

## Hosted version

A hosted version of this application can be accessed [here](https://nc-news-ch8f.onrender.com/api).

## Running locally

To connect to the two databases to run this application locally, you must:

1. Ensure you have [Node.js](https://nodejs.org/en/download) version 22 and [PostgreSQL](https://www.postgresql.org/download) 16 or higher
1. Clone this repository using `git clone https://github.com/Patterbear/be-nc-news`
2. Create two files in the main directory named '.env.development' and '.env.test'
3. Type into them 'PGDATABASE=nc_news' and 'PGDATABASE=nc_news_test', respectively.
4. Run the `npm install` command to install required packages
5. Run the `npm run setup-dbs` and `npm run seed` commands to create and seed the databases

By default, the application runs on 9090 (although you may alter it), so requests are to be made to [localhost:9090](http://localhost:9090).



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
