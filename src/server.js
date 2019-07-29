const fs = require('fs')
const express = require('express');
const $path= require('path')

const app = express();
const port = process.env.PORT || 5000;
const scoresDir= $path.resolve('./scores')
const publicDir = $path.resolve("./public");

app.use(express.static('public'))

app.get("/scores/:scoreId.json", (request, response) => {
  let filePath = scoreFilePath(request.params.scoreId);
  response.sendFile(filePath);
});

app.get('/scores/:scoreId', (request,response)=> {
  let filePath = scoreFilePath(request.params.articleId)
  if (fs.existsSync(filePath)) {
    let htmlFile = $path.join(publicDir, "article.html")
    response.sendFile(htmlFile)
  } else {
    response.status(404).send(`Article ${request.params.articleId} not found`);s
  }
})


app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});