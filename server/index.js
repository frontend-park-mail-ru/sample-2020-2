'use strict';

const childProc = require('child_process');
const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

const users = {
  'd.dorofeev@corp.mail.ru': {
    email: 'd.dorofeev@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 3,
  },
  's.volodin@corp.mail.ru': {
    email: 's.volodin@corp.mail.ru',
    password: 'password',
    age: 23,
    score: 100500,
    images: [
      'https://instagram.fhel3-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/119044639_453470878863441_2035065531229470727_n.jpg?_nc_ht=instagram.fhel3-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=5cTKsnnWkA0AX-l0xMT&oh=978a68434a42d54828554c49903a5627&oe=5F882EA1',
      'https://instagram.fhel3-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118849269_2730829927204318_169887671624349097_n.jpg?_nc_ht=instagram.fhel3-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=M2MVHDTozRgAX9PlfAP&oh=e5aef58f52cef3fd804d24ac783b4514&oe=5F88C781',
      'https://scontent-hel2-1.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/118774093_783199319099273_1819117477767462570_n.jpg?_nc_ht=scontent-hel2-1.cdninstagram.com&_nc_cat=105&_nc_ohc=mR1F7VclKZMAX-ZOEdv&oh=25e387df9ba44eeb180bd10e1cea9404&oe=5F88DB2E',
      'https://instagram.fhel3-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118600564_3818343914845969_5087219771600201694_n.jpg?_nc_ht=instagram.fhel3-1.fna.fbcdn.net&_nc_cat=101&_nc_ohc=BkAs_xkv0YEAX9DHxAr&oh=e42d651922b9fb268a1728987fcd0fa8&oe=5F8B007B',
      'https://instagram.fhel3-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118285262_313638513404766_3523723809313368628_n.jpg?_nc_ht=instagram.fhel3-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=18omSXOUf70AX8-glwk&oh=5168f537546ffd2fe5dc997aceb31942&oe=5F896575',
    ]
  },
  'aleksandr.tsvetkov@corp.mail.ru': {
    email: 'aleksandr.tsvetkov@corp.mail.ru',
    password: 'password',
    age: 26,
    score: 72,
    images: [
      'https://instagram.fhel6-1.fna.fbcdn.net/v/t51.2885-15/e35/20065516_1579389418799307_5149198199109451776_n.jpg?_nc_ht=instagram.fhel6-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=ktWZc__XFUQAX-fWvkE&oh=12bcfb9bc4a65628f62376f40847fdd1&oe=5F8962D5',
      'https://images.immediate.co.uk/production/volatile/sites/3/2019/05/EBC1840_v228.1047-eb60675.jpg?quality=90&resize=768,574',
      'https://instagram.fhel6-1.fna.fbcdn.net/v/t51.2885-15/e35/16583858_168051673696142_846500378588479488_n.jpg?_nc_ht=instagram.fhel6-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=3_Oaa6iUOlMAX_Q32lA&oh=a4e5587c32edc6bb11b33cd41866cb67&oe=5F87899B',
    ],
  },
  'a.ostapenko@corp.mail.ru': {
    email: 'a.ostapenko@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 72,
  },
  'i.drujinin@corp.mail.ru': {
    email: 'i.drujinin@corp.mail.ru',
    password: 'qwerty',
    age: 26,
    score: 123,
    images: [
      'https://snworksceo.imgix.net/car/614a86c8-405f-4fd8-b60d-93998c769661.sized-1000x1000.jpg?w=1000',
      'https://instagram.fhrk1-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/80647096_1424554687699858_646400561738833743_n.jpg?_nc_ht=instagram.fhrk1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=zBLMvZfRiZUAX-ZD22X&_nc_tp=19&oh=7fadb14e85f3756e3855560ae8df99d2&oe=5F9A6763',
      'https://instagram.fhrk1-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/82181161_636588197145749_1924661975512329_n.jpg?_nc_ht=instagram.fhrk1-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=SA9sFqCW1C0AX8rN0Hh&_nc_tp=19&oh=bcd10c134563a377f82ca39d30a89db4&oe=5F9D8F88',
    ],
  },
};
const ids = {};

app.post('/signup', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  const age = req.body.age;
  if (
      !password || !email || !age ||
      !password.match(/^\S{4,}$/) ||
      !email.match(/@/) ||
      !(typeof age === 'number' && age > 10 && age < 100)
  ) {
    return res.status(400).json({error: 'Не валидные данные пользователя'});
  }
  if (users[email]) {
    return res.status(400).json({error: 'Пользователь уже существует'});
  }

  const id = uuid();
  const user = {password, email, age, score: 0, images: []};
  ids[id] = email;
  users[email] = user;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(201).json({id});
});

app.post('/login', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).json({error: 'Не указан E-Mail или пароль'});
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
  }

  const id = uuid();
  ids[id] = email;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(200).json({id});
});

app.get('/me', function (req, res) {
  const id = req.cookies['podvorot'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  users[email].score += 1;

  res.json(users[email]);
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
  childProc.exec(`open -a "Google Chrome" http://localhost:${port}`, (err) => {
    console.log({err});
  });
});
