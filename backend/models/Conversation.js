/**
 * Conversation model - private chat: only participants (or admin for support) can see.
 * Support conversation: participantIds = [customerUserId], isSupport = true.
 */
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      // ObjectId (ref User) when customer sends; 'support' when admin sends
    },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true, _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    isSupport: { type: Boolean, default: false, index: true },
    messages: [messageSchema],
  },
  { versionKey: false, timestamps: true }
);

conversationSchema.index({ participantIds: 1, isSupport: 1 });

export default mongoose.model('Conversation', conversationSchema);
