import express from "express";
import morgan from "morgan";
// import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

import globalError from "./api/controllers/errorController";
import { assignMedicineRoute } from "./api/routes/assignMedicine";
import { authRoute } from "./api/routes/auth";
import { emergencyMedicineRoute } from "./api/routes/emergencyMedicine";
import { expenseRoute } from "./api/routes/expenseRoute";
import { soldPigsRoute } from "./api/routes/soldPigsRoute";
import { feedRoute } from "./api/routes/feed";
import { feedInventoryRoute } from "./api/routes/feedInventory";
import { medicineInventoryRoute } from "./api/routes/medicineInventory";
import { pigRoute } from "./api/routes/pigDetails";
import { settingRoute } from "./api/routes/setting";

import * as cron from "node-cron";
import { feedingPlanCron } from "./utilServer/helpers/feeding_plan_cron";

import * as socketio from "socket.io";
import { dashboardUserRoute } from "./api/routes/dashboardUser";
import { notificationRoute } from "./api/routes/notification";
import { taskListRoute } from "./api/routes/taskList";
import { ServerToClientEvents, SocketData } from "./types/socketio";
import { findNotificationByUserIdCurrentDayDB } from "./utilServer/prismaCRUD/notificationDB";
import { medicinePlanCron } from "./utilServer/helpers/medicine_plan_cron";
import { breederPlanCron } from "./utilServer/helpers/breeder_plan_cron";
import { statisticsRoute } from "./api/routes/statisticsRoute";

const app = express();
const io = new socketio.Server<ServerToClientEvents, SocketData>();
// const dev = process.env.NODE_ENV !== 'production'
// const hostname = process.env.HOSTNAME!
const port = process.env.PORT! || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// const options: cors.CorsOptions = {
//     allowedHeaders: [
//         'Origin',
//         'X-Requested-With',
//         'Content-Type',
//         'Accept',
//         'X-Access-Token',
//     ],
//     credentials: true,
//     methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
//     origin: process.env.FRONTEND_BASEURL ? process.env.FRONTEND_BASEURL : '*',
//     preflightContinue: false,
// };

//use cors middleware
// app.use(cors(options));

// enable pre - flight
app.options("*", cors());

// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_BASEURL ?? "http://localhost:3000"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/pig", pigRoute);
app.use("/api/v1/assign-medicine", assignMedicineRoute);
app.use("/api/v1/emergency-medicine", emergencyMedicineRoute);
app.use("/api/v1/medicine-inventory", medicineInventoryRoute);
app.use("/api/v1/settings", settingRoute);
app.use("/api/v1/feed", feedRoute);
app.use("/api/v1/feed-inventory", feedInventoryRoute);
app.use("/api/v1/expense", expenseRoute);
app.use("/api/v1/sold-pigs", soldPigsRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/tasks", taskListRoute);
app.use("/api/v1/dashboard-user", dashboardUserRoute);
app.use("/api/v1/statistics", statisticsRoute);

io.on("connection", (socket: socketio.Socket) => {
  socket.on("join", async (userId: number) => {
    const users = await addUser(userId, socket.id);

    setInterval(() =>
      socket.emit(
        "connectedUsers",
        { users: users.filter((user) => user.userId !== userId) },
        10000
      )
    );
  });
});

cron.schedule(
  "0 0 * * *",
  // "5 * * * * *",
  async () => {
    console.log("Cron started...");
    feedingPlanCron();
    medicinePlanCron();
    breederPlanCron();
    io.on("connection", (socket: socketio.Socket) => {
      socket.on("noArg", () => {
        users.forEach(async (user) => {
          const notification = await findNotificationByUserIdCurrentDayDB(
            user.userId
          );
          socket.to(user.socketId).emit(`${notification}`);
        });
      });
    });
  },
  {
    timezone: "Asia/Kolkata",
  }
);
// const hostname = '192.168.1.2';
app.use(globalError);
//@ts-ignore
// app.listen(port, hostname, () => console.log(`Server is running at Port = ${port}`));
app.listen(port, () => console.log(`Server is running at Port = ${port}`));
