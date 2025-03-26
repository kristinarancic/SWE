import { cleanEnv, port, str } from 'envalid';
export default cleanEnv(process.env, {
  PORT: port(),
  CONNECTION_URI: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
});
