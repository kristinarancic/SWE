import { Schema, model, InferSchemaType } from 'mongoose';
const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    sender: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['Admin', 'Shop', 'Buyer'], required: true },
  },
  { timestamps: true }
);
type Notification = InferSchemaType<typeof notificationSchema>;
export default model<Notification>('Notification', notificationSchema);
