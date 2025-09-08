import express from express;
import dotenv from dotenv;
import mongoose from mongoose;
import ordersRouter from ./modules/orders/orders.controller;

dotenv.config();
const app = express();
app.use(express.json());

app.get(/health, (_, res) => res.json({ ok: true }));
app.use(/orders, ordersRouter);

const MONGO = process.env.MONGO_URI ?? mongodb://localhost:27017/frete;
const PORT = Number(process.env.PORT ?? 3000);

mongoose.connect(MONGO).then(() => {
  app.listen(PORT, () => console.log(Server listening ));
}).catch(err => {
  console.error(Mongo connection error, err);
  process.exit(1);
});

export default app;
