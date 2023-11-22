import express from "express";
import cors from "cors";
import request from "request";

const app = express();
app.use(cors());

const CLIENT =
  "AQWNI4tVaY80kB7lytV7z5CDYVdyxAl9GUJKu7CuWdGUgQy6ph6LMhemWQPEraO35VHtiR2AWjxNVmjg";
const SECRET =
  "EJmc2gisr3t_XQ5YxmhIEe6g2zJ7Gm7JMAoEO9qWQ73aWJdmvt52mw0NqIjOrPeUgzq5RCeOi5Vy7kuR";
const PAYPAL_API = "https://api-m.sandbox.paypal.com";
const auth = { user: CLIENT, pass: SECRET };

//controllers
const createPayment = (req, res) => {
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "150",
        },
      },
    ],
    application_context: {
      brand_name: "TECA Academy",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: "http://localhost:5000/execute-payment",
      cancel_url: "http://localhost:5000/cancel-payment",
    },
  };

  //request
  request.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      auth,
      body,
      json: true,
    },
    (err, response) => {
      res.json({ data: response.body });
    }
  );
};

const executePayment = (req, res) => {
  const token = req.query.token;

  request.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {
      auth,
      body: {},
      json: true,
    },
    (err, response) => {
      res.json({ data: response.body });
    }
  );
};

//Routes
app.post("/create-payment", createPayment);
app.get("/execute-payment", executePayment);

app.listen(5000);
console.log("LISTENING IN PORT 5000");
