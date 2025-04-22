import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Username should be at least 3 characters long'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [13, 'Email should be at least 13 characters long'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'Password should be at least 8 characters long'],
    },
    roles: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
