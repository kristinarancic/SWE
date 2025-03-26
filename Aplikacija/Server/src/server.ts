import app from './app';
import env from './config/validateEnv';
import mongoose from 'mongoose';

const PORT = env.PORT || 5000;
mongoose.set('strictQuery', true);
mongoose
  .connect(env.CONNECTION_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
