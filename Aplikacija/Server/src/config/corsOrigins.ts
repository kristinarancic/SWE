import allowedOrigins from './allowedOrigins';
const corsOrigins = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, success: boolean) => void
  ) => {
    // !origins is used so apps like postman etc. can be used for server testing
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin)
      callback(null, true);
    else callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
};
export default corsOrigins;
