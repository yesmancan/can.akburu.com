const express = require("express");
const compression = require("compression");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression())
  .get(["*.js", "*.css", "*.jpg", "*.png", "*.svg"], (req, res, next) => {
    req.url = req.url + ".gz";
    res.set("Content-Encoding", "gzip");
    next();
  });
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/under-construction", (req, res) =>
  res.render("pages/under-construction")
);
app.get("/", (req, res) => res.render("pages/index"));
app.get("/bakim", (req, res) => res.render("pages/bakim"));
app.get("/montaj", (req, res) => res.render("pages/montaj"));
app.get("/hakkimizda", (req, res) => res.render("pages/hakkimizda"));
app.get("/modernizasyon-ve-revizyon", (req, res) =>
  res.render("pages/modernizasyon-ve-revizyon")
);
app.get("/calismalarimiz-ve-yaptigimiz-uygulamalar", (req, res) =>
  res.render("pages/calismalarimiz-ve-yaptigimiz-uygulamalar")
);
app.get("/iletisim", (req, res) => res.render("pages/iletisim"));
app.post("/elevator-maintenance-proposal-form", (req, res) => {
  let transport = nodemailer.createTransport({
    host: "smtp.yandex.com",
    port: 465,
    auth: {
      user: "form@akburu.com",
      pass: "Ca123456+",
    },
  });

  const html = `<h2>Asansör Sayısı ${req.body.howmuchelevator}</h2><br>
    <h2>Durak Sayısı ${req.body.howmuchelevatorfloorcount}</h2><br>
    <h2>il ${req.body.city}</h2><br>
    <h2>ilçe ${req.body.district}</h2><br>
    <h2>Mahalle ${req.body.neighborhood}</h2><br>
    <h2>Ad Soyad ${req.body.namesurname}</h2><br>
    <h2>Email ${req.body.email}</h2><br>
    <h2>Telefon ${req.body.phone}</h2><br>
    <h2>Mesaj ${req.body.whatarethedetailsofyourneed}</h2><br>`;

  const message = {
    from: "form@akburu.com",
    to: "can@akburu.com;ilyas@akburu.com;riza@akburu.com;;emre.cem@akburu.com",
    subject: "Asansör Bakım Teklif Formu",
    html: html,
  };

  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.redirect("/#ok");
});
app.post("/sizi-arayalim", (req, res) => {
  let transport = nodemailer.createTransport({
    host: "smtp.yandex.com",
    port: 465,
    auth: {
      user: "form@akburu.com",
      pass: "Ca123456+",
    },
  });

  const html = `
    <h2>Telefon : ${req.body.inputPhone}</h2><br>
    <h2>Konu : Aranmak İstiyor</h2>`;

  const message = {
    from: "form@akburu.com",
    to: "can@akburu.com;ilyas@akburu.com;riza@akburu.com;emre.cem@akburu.com",
    subject: "Beni Ara Formu",
    html: html,
  };

  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.redirect("/#ok");
});
app.post("/contact-form", (req, res) => {
  let transport = nodemailer.createTransport({
    host: "smtp.yandex.com",
    port: 465,
    auth: {
      user: "form@akburu.com",
      pass: "Ca123456+",
    },
  });

  const html = `<h2>Ad Soyad : ${req.body.inputNameSurname}</h2><br>
    <h2>Mail : ${req.body.inputEmail}</h2><br>
    <h2>Telefon : ${req.body.inputPhone}</h2><br>
    <h2>Konu : ${req.body.inputMessage}</h2>`;

  const message = {
    from: "form@akburu.com",
    to: "can@akburu.com;ilyas@akburu.com;riza@akburu.com;emre.cem@akburu.com",
    subject: "iletisim Formu",
    html: html,
  };

  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.redirect("/#ok");
});
