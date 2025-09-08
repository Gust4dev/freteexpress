import request from supertest;
import mongoose from mongoose;
import app from ../src/main;
import { Order } from ../src/modules/orders/orders.model;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST ?? mongodb://localhost:27017/frete_test);
  await Order.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe(POST /orders, () => {
  it(should create order when price piso, async () => {
    const res = await request(app).post(/orders).send({
      pickup: Ponto A,
      dropoff: Ponto B,
      distanceKm: 10,
      vehicleType: moto,
      price: 20
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(_id);
  });

  it(should reject when price below piso, async () => {
    const res = await request(app).post(/orders).send({
      pickup: A,
      dropoff: B,
      distanceKm: 10,
      vehicleType: carro,
      price: 10
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(error, price_below_antt_minimum);
    expect(res.body).toHaveProperty(piso);
  });

  it(should validate required fields, async () => {
    const res = await request(app).post(/orders).send({
      pickup: A,
      distanceKm: -1,
      vehicleType: moto,
      price: 30
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(validation);
  });
});
