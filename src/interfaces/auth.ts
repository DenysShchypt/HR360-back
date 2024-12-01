export interface IJwtPlayLoad {
  user: IUserJWT;
  iat: number;
  exp: number;
}
export interface IUserJWT {
  id: string;
  email: string;
  username: string;
}
