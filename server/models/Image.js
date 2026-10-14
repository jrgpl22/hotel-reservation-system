import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/webp'],
      required: true,
    },
    size: { type: Number, required: true },
    kind: { type: String, enum: ['room', 'avatar'], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

imageSchema.index({ uploadedBy: 1, kind: 1 });

const Image = mongoose.model('Image', imageSchema);

export default Image;