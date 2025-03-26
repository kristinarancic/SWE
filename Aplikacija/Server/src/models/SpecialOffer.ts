import { Schema, model, InferSchemaType } from 'mongoose';
const specialOfferSchema = new Schema(
  {
    confirmedAt: {
      type: Date, default: null
    },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    paymentType: { type: String, default: null },
  },
  { timestamps: true }
);
type SpecialOffer = InferSchemaType<typeof specialOfferSchema>;
export default model<SpecialOffer>('SpecialOffer', specialOfferSchema);
