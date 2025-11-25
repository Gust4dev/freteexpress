import { Request, Response } from "express";
import { Order } from "../models/orders";
import { Transporter } from "../models/transporters";
import { Types } from "mongoose";

export async function getDriverStats(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthenticated" });

    const transporter = await Transporter.findOne({ userId });
    if (!transporter) {
      // Se não for motorista, retorna stats zerados ou erro
      return res.status(404).json({ error: "driver_profile_not_found" });
    }

    // Calcular ganhos dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completedOrders = await Order.find({
      transporterId: transporter._id,
      status: "delivered",
      updatedAt: { $gte: sevenDaysAgo },
    }).lean();

    // Agrupar por dia
    const earningsMap = new Map<string, number>();
    // Inicializa os últimos 7 dias com 0
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      earningsMap.set(key, 0);
    }

    let totalEarnings7Days = 0;

    completedOrders.forEach((order) => {
      if (order.updatedAt) {
        const key = new Date(order.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        const current = earningsMap.get(key) || 0;
        earningsMap.set(key, current + order.price);
        totalEarnings7Days += order.price;
      }
    });

    // Converter para array reverso (antigo -> novo)
    const earningsHistory = Array.from(earningsMap.entries())
      .map(([date, value]) => ({ date, value }))
      .reverse();

    // Calcular estatísticas gerais
    const totalOrders = await Order.countDocuments({
      transporterId: transporter._id,
      status: "delivered",
    });

    // Mock de conquistas por enquanto, mas baseado em dados reais se possível
    const achievements = [];
    if (totalOrders > 10) {
      achievements.push({
        title: "Rei da Estrada",
        progress: Math.min(100, (totalOrders / 50) * 100),
        icon: "truck"
      });
    }
    if (transporter.rating && transporter.rating > 4.8) {
      achievements.push({
        title: "5 Estrelas",
        progress: 100,
        icon: "star"
      });
    }

    return res.json({
      earningsHistory,
      totalEarnings7Days,
      rating: transporter.rating || 5.0,
      totalOrders,
      achievements
    });

  } catch (err) {
    console.error("getDriverStats error", err);
    return res.status(500).json({ error: "internal" });
  }
}
