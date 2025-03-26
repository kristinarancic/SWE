import { InferSchemaType, Schema, model } from 'mongoose';
const chatMessageSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    sentBy: { type: String, enum: ['User', 'Shop'], required: true },
  },
  { timestamps: true } // This creates CreatedAt & Updated At
);
type ChatMessage = InferSchemaType<typeof chatMessageSchema>;
export default model<ChatMessage>('ChatMessage', chatMessageSchema);
