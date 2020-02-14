import "reflect-metadata";
import { getConnection, createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import 'dotenv/config';

const port = process.env.PORT || 3000;
const ServerHost = process.env.SERVER_HOST || '127.0.0.1';

//Connects to the Database -> then starts the express
createConnection("devDatabase")
  .then(async connection => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(port, () => {
      console.log(`Server started on ${ServerHost}:${port}`);
    });
  })
  .catch(error => console.error(error));