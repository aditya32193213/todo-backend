import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
      index:     true,
    },
    // select: false ensures the password hash is NEVER returned by any query
    // unless the caller explicitly opts in with .select("+password").
    //
    // Previously this was missing, which meant:
    //   - User.findById(id)           → included password hash in result
    //   - User.findOne({ email })     → included password hash in result
    //
    // The only place that should ever read the hash is auth.service.js inside
    // loginUserService and updatePasswordService — both now use .select("+password")
    // to opt in explicitly. Every other query gets the field excluded automatically.
    password: {
      type:      String,
      required:  true,
      minlength: 6,
      select:    false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);