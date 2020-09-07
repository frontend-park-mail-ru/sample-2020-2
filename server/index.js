const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  console.log('requested', req.url);

  const path = `.${req.url === '/' ? '/index.html' : req.url}`;

  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);

  fs.readFile(path, (err, file) => {
    if (err) {
      console.log('file read error', path, err);
      res.write('error');
      res.end();

      return;
    }

    console.log('file read', path);

    res.write(file);
    res.end();
  });

  console.log('after read file')
});

server.listen(3000);
