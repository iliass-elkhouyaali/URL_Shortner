const express = require("express");
const app = express();
const cors = require("cors");
const dns = require("dns");
const bodyParser = require("body-parser");

let urlDatabase = {};
let id = 1;

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  let inputUrl = req.body.url;

  try {
    const parsedUrl = new URL(inputUrl);
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }

      const shortUrl = id++;
      urlDatabase[shortUrl] = inputUrl;
      res.json({
        original_url: inputUrl,
        short_url: shortUrl,
      });
    });
  } catch {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const shortUrl = req.params.id;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for given input" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
