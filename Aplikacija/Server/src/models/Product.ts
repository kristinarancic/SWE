import { Schema, model, InferSchemaType } from 'mongoose';
const productSchema = new Schema(
  {
    name: { type: String, maxLength: 50, required: true },
    price: { type: Number, default: null },
    type: {
      type: String,
      default: 'Drugo',
      enum: [
        'Drugo',
        'Buket',
        'Svadbeni cvetni aranžman',
        'Pogrebni cvetni aranžman',
        'Sobno saksijsko cveće',
        'Spoljno saksijsko cveće',
      ],
    },
    photo: { type: String, default: null },
    description: { type: String, maxLength: 500, default: null },
    quantity: { type: Number, default: 0 },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  { timestamps: true }
);
type Product = InferSchemaType<typeof productSchema>;
export default model<Product>('Product', productSchema);
