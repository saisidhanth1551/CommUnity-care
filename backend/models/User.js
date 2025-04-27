import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Username should be at least 3 characters long'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [5, 'Email should be at least 5 characters long'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'Password should be at least 8 characters long'],
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Validates that the phone number is a 10-digit number
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`, // Custom error message
      },
    },
    profilePicture: {
      type: String,
      default: null,
    },
    roles: {
      type: [String],
      enum: ['customer', 'worker'],
      default: ['customer'],
    },
    categories: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Ensure role and roles stay in sync
userSchema.pre('save', function(next) {
  // If roles array is updated, set the primary role to the first role in the array
  if (this.isModified('roles')) {
    this.role = this.roles[0] || 'customer';
  }
  // If the primary role is updated, ensure it's in the roles array
  else if (this.isModified('role')) {
    if (!this.roles.includes(this.role)) {
      this.roles.push(this.role);
    }
  }
  next();
});

// We're now handling password hashing in the controller
// to avoid double-hashing issues

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
