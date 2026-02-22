import type { AuthSchema } from "../../schema/auth.schema";

export const login = async (data: AuthSchema.RequestLogin): Promise<AuthSchema.ResultLogin> => {
  return {
    access_token: "dummy_access_token",
    refresh_token: "dummy_refresh_token",
  };
};
