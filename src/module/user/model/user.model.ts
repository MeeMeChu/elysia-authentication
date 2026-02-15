import { t } from "elysia";

export namespace UserModel {
  export const user = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
  });

  export type User = typeof user.static;
}
