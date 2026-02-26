import { t } from "elysia";

export namespace ErrorModel {
  export const apiErrorUser = t.Object(
    {
      code: t.Number(),
      message: t.String(),
    },
    {
      description: "API Error Response",
      example: {
        code: 400,
        message: "Invalid request data",
      },
    },
  );

  export const apiErrorServer = t.Object(
    {
      code: t.Number(),
      message: t.String(),
    },
    {
      description: "API Error Response",
      example: {
        code: 500,
        message: "Internal server error",
      },
    },
  );

  export type apiErrorUser = typeof apiErrorUser.static;
  export type apiErrorServer = typeof apiErrorServer.static;
}
