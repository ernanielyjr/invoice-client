const express = require('express');
const path = require('path');
const app = express();


// TODO: replace https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.lightbox.js com uma environment

app.use(express.static(__dirname + '/dist/myplan-client'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/dist/myplan-client/index.html'));
});
app.listen(process.env.PORT || 8080);
