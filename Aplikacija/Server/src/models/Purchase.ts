import { Schema, model, InferSchemaType } from 'mongoose';
const purchaseSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
    ],
    confirmedAt: {
      type: Date, default: null
    },
    price: { type: Number, required: true },
    paymentType: { type: String, default: null },
  },
  { timestamps: true }
);
type Purchase = InferSchemaType<typeof purchaseSchema>;
export default model<Purchase>('Purchase', purchaseSchema);
