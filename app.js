const express = require('express');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const nodemailer = require('nodemailer');

// Configurations
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/styles')));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');;
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(expressLayouts);

// Nodemailer
const userEmail = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  user: '28d5c0209e98d6',
  pass: 'c0f8fff472d74c'
}

async function sendCode(code, email) {
  try {
    const mail = await transporter.sendMail({
      html: `Hello, your number to access is 
      <strong>${code.c1}${code.c2}${code.c3}${code.c4}</strong>`,
      subject: 'No Reply.',
      from: 'BlueJay <3ca7c61d3d-e83b48@inbox.mailtrap.io>',
      to: [email]
    });
    //console.log(mail);
    return 'Success sending code';
  } catch(err) {
    return 'Error sending code: ' + err;
  }
}

const transporter = nodemailer.createTransport({
  host: userEmail.host,
  port: userEmail.port,
  secure: false,
  auth: {
    user: userEmail.user,
    pass: userEmail.pass
  },
  tls: {
    rejectUnauthorized: false,
  }
});

// Routes

app.get('/', async (req, res) => {
  res.render('home/index');
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

let code_data = null;
function getCode() {
  code_data = {
    c1: getRandomInt(0, 9),
    c2: getRandomInt(0, 9),
    c3: getRandomInt(0, 9),
    c4: getRandomInt(0, 9),
  }
  return code_data;
}

app.post('/confirm', async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  }
  if (!data.email || !data.password) {
    console.log('error');
  } else {
    
    await sendCode(getCode(), data.email);
    
    res.render('home/confirm');
  }
});

app.post('/confirm-code', (req, res) => {
  const data = {
    c1: req.body.c1,
    c2: req.body.c2,
    c3: req.body.c3,
    c4: req.body.c4,
  }

  if ( code_data.c1 == data.c1 && code_data.c2 == data.c2 && code_data.c3 == data.c3 && code_data.c4 == data.c4) {
    res.send('Congratulations!');
  } else {
    console.log('Error')
    res.redirect('/');
  }

});

const port = process.env.PORT || 4040;
app.listen(port, () => console.log('Listening on http://localhost:4040/'));