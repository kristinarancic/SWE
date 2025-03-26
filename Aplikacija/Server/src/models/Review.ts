import { Schema, model, InferSchemaType } from 'mongoose';
const reviewSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: String, enum: ['User', 'Shop'], required: true },
    message: { type: String, maxLength: 200, default: null },
    grade: { type: Number, required: true, min: 0, max: 5, default: NaN },
    reported: { type: Boolean, default: false },
  },
  { timestamps: true }
);
type Review = InferSchemaType<typeof reviewSchema>;
export default model<Review>('Review', reviewSchema);
