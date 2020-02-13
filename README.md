# Project Build with TypeORM Express And JWT

Steps to run this project:

1. Execute `npm i` command
2. Setup your database settings inside `ormconfig.json` file
3. Execute `npm start` command

To Create a migration
# To Read More About TypeORM Migration Docs
+ http://typeorm.io/#/migrations


1. Execute `typeorm migration:create -n migrationName` command
2. Check if the server is runing if not execute `npm start` command
3. To apply the creating migration execute `npm run migration:run` command