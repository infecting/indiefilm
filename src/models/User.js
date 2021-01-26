"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    password: { type: String, required: true },
    movies: { type: Number, default: 0 }
}, { timestamps: true });
const User = mongoose_1.model("User", userSchema);
exports.default = User;
