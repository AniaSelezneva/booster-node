const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  service: "smtp.mail.ru",
  host: "smtp.mail.ru",
  port: 465,
  auth: {
    user: "ellie_meadows@mail.ru",
    pass: process.env.PASS,
  },
  secureConnection: false,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/api/order", (req, res) => {
  let { name, phone, items, targetEmail } = req.body;

  items = JSON.parse(items);

  const html = `<h3>Hовый заказ:</h3>
    <br>
     <table>
        <tr>
            <td><strong>Имя</strong></td>
            <td><strong>Телефон</strong></td>
        </tr> 
        <tr>
            <td>${name}</td>
            <td>${phone}</td>
        </tr> 
    </table>
<hr>
    <table>
        <tr>
            <td>Id товара</td>
            <td>Название товара</td>
            <td>Количество</td>
        </tr>
        ${items.map(
          (item) =>
            `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
        </tr>`
        )}

    </table>
    
    <style type="text/css">
    table,tr,td {
        border: 1px solid black;
        border-collapse: collapse;
    }
   </style>
   `;

  const mailOptions = {
    from: "ania.slz@mail.ru",
    to: targetEmail,
    subject: "Новый заказ",
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ msg: "Error occured" });
    } else {
      console.log(`Email sent: ${info.response}`);
      res.status(200);
      res.send({ msg: "Order successfully added" });
    }
  });
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
