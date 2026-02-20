import Elysia from "elysia";

export const UserController = new Elysia().group("/user", (app) =>
  app.get("/", () => {
    return "Hello World!";
  }),
);
