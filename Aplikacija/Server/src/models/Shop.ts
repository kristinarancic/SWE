import { Schema, model, InferSchemaType } from 'mongoose';
const shopSchema = new Schema(
  {
    role: { type: String, default: 'Shop', immutable: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: null },
    residence: {
      address: { type: String, default: null, maxLength: 50 },
      city: { type: String, default: null },
      zip: { type: Number, default: null },
    },
    password: { type: String, required: true },
    photo: { type: String, default: null },
    description: { type: String, maxLength: 1000, default: null },
    workingHours: {
      workingDays: {
        start: { type: String },
        finish: { type: String },
      },
      saturday: {
        start: { type: String },
        finish: { type: String },
      },
      sunday: {
        start: { type: String },
        finish: { type: String },
      },
    },
    gdp: { type: Number, required: true },
    registrationNumber: { type: Number, required: true },
    facebook: { type: String, maxLength: 150, default: null },
    instagram: { type: String, maxLength: 150, default: null },
    suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);
type Shop = InferSchemaType<typeof shopSchema>;
export default model<Shop>('Shop', shopSchema);
