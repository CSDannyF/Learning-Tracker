import express from "express";
import fs from "fs";
import cors from "cors";
import { join } from "path";

import __dirname from './__dirname.js';

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

app.use(cors());
app.use(express.json());
app.use("/", express.static(join(__dirname, 'public', 'browser')));

app.listen(port, () => {
  console.log(`Node-express server is listening on port ${port}`);
});