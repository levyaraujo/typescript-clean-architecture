import * as http from "node:http";
import { UserRepository } from "./db/user.repository";
import { UserCases } from "../app/use-cases";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const userRepository = new UserRepository();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/user" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const userData = JSON.parse(body);
        const useCases = new UserCases(userRepository);
        const createdUser = await useCases.createUser(userData);
        res.end(JSON.stringify({ createdUser }));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid request body" }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }

  if (req.url === "/user" && req.method === "GET") {
    const useCases = new UserCases(userRepository);
    const users = await useCases.listUsers();
    res.end(JSON.stringify(users));
  }
});

export function startServer() {
  server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/ 🚀`);
  });
}
