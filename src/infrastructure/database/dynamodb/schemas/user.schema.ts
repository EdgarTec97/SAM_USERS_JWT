import { Schema } from 'dynamoose';

export const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      hashKey: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      index: {
        name: 'UsernameIndex',
        type: 'global',
        project: true
      }
    },
    email: {
      type: String,
      required: true,
      index: {
        name: 'EmailIndex',
        type: 'global',
        project: true
      }
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    },
    age: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      enum: ['root', 'standard', 'visitor']
    },
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Number,
      required: true,
      default: Date.now(),
      rangeKey: true
    },
    updatedAt: {
      type: Number,
      required: true,
      default: Date.now()
    }
  },
  {
    saveUnknown: true
  }
);
