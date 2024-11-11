import { sign } from "jsonwebtoken";

export const createAccessToken = (user: any) => {
    return sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '15m'
    });
  };

  export const createRefreshToken = (user: any) => {
    return sign(
        { id: user.id },process.env.REFRESH_TOKEN_SECRET as string,{
            expiresIn: "7d"
        }
    );
};
