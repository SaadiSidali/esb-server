# Server for job-hiring-thingy-idk

## Install dependencies and run it

```sh
npm i
npm run start:dev
```

GraphQL endpoint should be available at 

[http://localhost:3000/graphql](http://localhost:3000/graphql)

To set db options check  **/src/app.module.ts** 

```ts
TypeOrmModule.forRoot({
      type: 'postgres', // DB TYPE, options: {mysql,mongo,sqflite ...}
      host: 'localhost', 
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'zooweemama', // DB name
    }),
```