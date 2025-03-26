import { Schema, model, InferSchemaType } from 'mongoose';
const userSchema = new Schema(
  {
    firstName: { type: String, maxLength: 20, required: true },
    lastName: { type: String, maxLength: 20, required: true },
    email: { type: String, required: true, lowercase: true },
    role: { type: String, enum: ['Buyer', 'Admin'], default: 'Buyer' },
    phone: { type: String, default: null },
    residence: {
      address: { type: String, default: null, maxLength: 50 },
      city: { type: String, default: null },
      zip: { type: Number, default: null },
    },
    password: { type: String, required: true },
    photo: { type: String, default: null },
    suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);
type User = InferSchemaType<typeof userSchema>;
export default model<User>('User', userSchema);
