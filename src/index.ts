import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = 5000;

app.use(express.json());

app.post("/errors", (req: Request, res: Response) => {
  const { errors, deviceId } = req.body;

  const csv = transformJSONtoCSV(errors);

  const filePath = path.resolve(
    __dirname,
    `../logs/errors/${deviceId}-errors.csv`
  );

  fs.writeFile(filePath, csv, (err) => {
    if (err) {
      console.log("Houve um erro ao gravar o arquivo: ", err);
      res.status(500).send("Houve um erro ao gravar o arquivo");
    } else {
      console.log("Arquivo salvo com sucesso");
      res.status(200).send("Arquivo salvo com sucesso");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const transformJSONtoCSV = (json: string) => {
  const items = JSON.parse(json);
  const replacer = (key: string, value: string) =>
    value === null ? "" : value;
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","),
    ...items.map((row: { [x: string]: any }) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  console.log(csv);
  return csv;
};
