import mongoose from "mongoose";

interface ConversationAttrs {
  users?: Array<string>;
  channel: string;
  messages: Array<{
    ughId: string;
    text: string;
    createdAt: number;
  }>;
}

export interface ConversationDoc extends mongoose.Document {
  users: Array<string>;
  channel: string;
  messages: Array<{
    ughId: string;
    text: string;
    createdAt: number;
  }>;
}

interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

const conversationSchema = new mongoose.Schema(
  {
    users: [String],
    channel: String,
    messages: [
      {
        ughId: String,
        text: String,
        createdAt: Number,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

conversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs);
};

export const Conversation = mongoose.model<ConversationDoc, ConversationModel>(
  "Conversations",
  conversationSchema
);
