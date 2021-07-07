const fs = require('fs')
const express = require('express');
const $path= require('path')

const app = express();
const port = process.env.PORT || 5000;
const scoresDir= $path.resolve('./scores')


app.get("/scores", (request, response) => {
  let theFile = $path.join(scoresDir, 'scores.json')
  const data =fs.readFileSync(theFile)
  const json = JSON.parse(data)
  response.type('json').send(json);
});

app.post('/scores', express.json(), (request,response) => {
  const theFile= $path.join(scoresDir, 'scores.json')
  const oldData = fs.readFileSync(theFile)
  const jsonData = JSON.parse(oldData)
  jsonData.highScores.push(request.body)
  fs.writeFileSync(theFile, JSON.stringify(jsonData))
  response.status(201).send('Success')
  })


app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});