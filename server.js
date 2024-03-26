import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";
import { connectDB } from "./src/config/db.js";
import { WebSocketServer } from "ws";

import emailRoutes from "./src/routes/emailRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import schoolRoutes from "./src/routes/schoolRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import courseUnitsRoutes from "./src/routes/courseUnitRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";

// import parentRoutes from "./src/routes/parentRoutes.js";
// import studentRoutes from "./src/routes/studentRoutes.js";
// import mpesaRoutes from "./src/routes/mpesaRoutes.js";
// import teacherRoutes from "./src/routes/teacherRoutes.js";
// import accountRoutes from "./src/routes/accountantRoutes.js";
// import adminRoutes from "./src/routes/adminRoutes.js";

import chatRoutes from "./src/routes/chatRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import conversationRoutes from "./src/routes/conversationRoutes.js";
import feeRoutes from "./src/routes/feeRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import timetableRoutes from "./src/routes/timetableRoutes.js";
import examRoutes from "./src/routes/examRoutes.js";
import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import assignmentSubmissionRoutes from "./src/routes/assignmentSubmissionRoutes.js";

import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/parents", parentRoutes);
// app.use("/api/students", studentRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courseunits", courseUnitsRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/accountants", accountRoutes);
app.use("/api/attendance", attendanceRoutes);
// app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/schoolfees", feeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/timetable", timetableRoutes);
// app.use("/api/mpesa", mpesaRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissiions", assignmentSubmissionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const wss = new WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  console.log("WebSocket connected...");

  // Listen for messages from clients
  connection.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      client.send(message);
      console.log("sent  ", message);
    });
  });

  // Listen for the connection to close
  connection.on("close", () => {
    console.log("WebSocket disconnected...");
  });
});
