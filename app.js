const express = require('express');
const app = express();
const path = require('path');
const multer  = require('multer')
const cors = require('cors')
app.use(cors())
const upload = multer({ dest: '../uploads/' })
const parsefont = require('parsefont');
const JSZip = require('jszip');
const parsefontRoot = '/parsefont';
const PORT = process.env.PORT || 8002;

app.use((req, res, next) => {
  console.log(`${req.method} : ${req._parsedUrl.path}`);
  next();
})

app.get(`${parsefontRoot}/`, (req, res) => {
  res.sendFile(path.join(__dirname, `./index.html`));
})

app.post(`${parsefontRoot}/convert`, upload.array('fileToUpload[]'), (req, res) => {
  const { filesbase64 } = req.body
  parsefont.get({ svgsData: JSON.parse(filesbase64) })
  .then(fiels => {
    var zip = new JSZip();
    zip.file(`index.html`, fiels.html);
    zip.file(`font.css`, fiels.style);
    zip.file(`fontsvg.svg`, fiels.fontSvg);
    zip.file(`font.ttf`, fiels.svg2ttfbuf);
    zip.file(`font.eot`, fiels.ttf2eotbuf);
    zip.file(`font.woff`, fiels.ttf2woffbuf);
    return zip.generateAsync({ type: "base64" });
  })
  .then(response => res.send(response))
  .catch(error => {
    console.error(error.stack?error.stack:error);
    res.status(400).send(error.stack?error.stack:error)
  });
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));