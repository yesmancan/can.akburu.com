const express = require("express");
const compression = require("compression");
const path = require("path");
const nodemailer = require("nodemailer");
const lingua = require("lingua");

const PORT = process.env.PORT || 5000;
const app = express();

express()
  .use(
    lingua(app, {
      defaultLocale: "tr",
      path: __dirname + "/i18n",
      storageKey: 'lang'
    })
  )
  .use(express.json())
  .use(express.urlencoded())
  .use(express.static(path.join(__dirname, "public")))
  .use(compression())
  .get(["*.js", "*.css", "*.jpg", "*.png", "*.svg"], (req, res, next) => {
    req.url = req.url + ".gz";
    res.set("Content-Encoding", "gzip");
    next();
  })
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/under-construction", (req, res) =>
    res.render("pages/under-construction")
  )
  .get("/", (req, res) => res.render("pages/index"))
  .get("/services/business-specific-software-solutions", (req, res) =>
    res.render("pages/services/business-specific-software-solutions")
  )
  .get("/services/e-commerce-solutions", (req, res) =>
    res.render("pages/services/e-commerce-solutions")
  )
  .get("/services/b2b-and-b2c-solutions", (req, res) =>
    res.render("pages/services/b2b-and-b2c-solutions")
  )
  .get("/services/digital-marketing-&-seo", (req, res) =>
    res.render("pages/services/digital-marketing-&-seo")
  )
  .get("/services/enterprise-resource-&-planning", (req, res) =>
    res.render("pages/services/enterprise-resource-&-planning")
  )
  .get("/services/data-analysis-and-big-data-solutions", (req, res) =>
    res.render("pages/services/data-analysis-and-big-data-solutions")
  )
  .get("/services/web-service-integrations", (req, res) =>
    res.render("pages/services/web-service-integrations")
  )
  .get("/hakkimizda", (req, res) => res.render("pages/hakkimizda"))
  .get("/iletisim", (req, res) => res.render("pages/iletisim"))
  .post("/contact-form", (req, res) => {
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
  })
  .post("/sizi-arayalim", (req, res) => {
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

    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    res.redirect("/#ok");
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
