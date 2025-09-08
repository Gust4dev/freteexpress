import { Router } from express;
import { z } from zod;
import { Order } from ./orders.model;
import { calcPisoMinimo } from ../../libs/antt;

const router = Router();

const CreateOrderSchema = z.object({
  pickup: z.string().min(3),
  dropoff: z.string().min(3),
  distanceKm: z.number().positive(),
  vehicleType: z.enum([moto, carro])
});

router.post(/, async (req, res) => {
  try {
    const parsed = CreateOrderSchema.parse(req.body);
    const piso = calcPisoMinimo(parsed.distanceKm, parsed.vehicleType);
    if (req.body.price < piso) {
      return res.status(400).json({ error: price_below_antt_minimum, piso });
    }
    const order = new Order({ ...parsed, price: req.body.price });
    await order.save();
    return res.status(201).json(order);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error(err);
    return res.status(500).json({ error: internal_error });
  }
});

export default router;
