import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectMongoDB from "./config/db-config.js";
import usersRoute from "./routes/users-route.js";
import planetsRoute from "./routes/planets-route.js";
import stripePaymentsRoute from "./routes/stripePayments-route.js";
import paymentsRoute from "./routes/payments-route.js";
import reportsRoute from "./routes/reports-route.js";

dotenv.config();

const app = express();
connectMongoDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRoute);
app.use("/api/planets", planetsRoute);
app.use("/api/stripePayments", stripePaymentsRoute);
app.use("/api/payments", paymentsRoute);
app.use("/api/reports", reportsRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
