import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "./logger";

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(httpServer: HttpServer, corsOptions: any) {
    this.io = new SocketIOServer(httpServer, {
      cors: corsOptions,
      transports: ['websocket', 'polling']
    });

    this.io.on("connection", (socket: Socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on("join_room", (room: string) => {
        socket.join(room);
        logger.info(`Socket ${socket.id} joined room: ${room}`);
      });

      socket.on("leave_room", (room: string) => {
        socket.leave(room);
        logger.info(`Socket ${socket.id} left room: ${room}`);
      });

      socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });

    logger.info("Socket.io initialized");
  }

  public emit(room: string, event: string, data: any) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    } else {
      logger.warn("Socket.io not initialized, cannot emit event");
    }
  }
}

export const socketService = SocketService.getInstance();
