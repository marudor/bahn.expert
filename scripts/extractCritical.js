/* eslint no-sync: 0 */
process.env.NODE_ENV = 'production';
require('../dist/server/server/localStorageShim');
const { createApp } = require('../dist/server/server/app');
const request = require('supertest');
const critical = require('critical');
const fs = require('fs');
const stats = require('../dist/client/static/stats.json');
const cssName = stats.assetsByChunkName.main.find(a => a.endsWith('css'));

createApp().then(app => {
  const puppeteer = require('puppeteer');
  const browserPromise = puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  const server = app.listen();

  request(server)
    .get('/')
    .end((err, res) => {
      if (err) return;
      fs.writeFileSync('dist/client/static/temp.html', res.text);
      critical
        .generate({
          penthouse: {
            puppeteer: {
              getBrowser: () => browserPromise,
            },
          },
          inline: true,
          base: 'dist/client/',
          src: 'static/temp.html',
          width: 1300,
          height: 900,
        })
        .then(({ css, uncritical }) => {
          fs.writeFileSync('dist/server/server/views/critical.ejs', css);
          fs.writeFileSync(`dist/client/static/${cssName}`, uncritical);
          fs.unlinkSync('dist/client/static/temp.html');
        });
      server.close();
    });
});
