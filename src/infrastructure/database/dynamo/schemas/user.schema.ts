import { Schema } from 'dynamoose';

export const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      hashKey: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
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
      required: true,
      rangeKey: true
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
      type: String,
      required: true,
      default: new Date().toISOString()
    },
    updatedAt: {
      type: String,
      required: true,
      default: new Date().toISOString()
    }
  },
  {
    saveUnknown: true
  }
);
