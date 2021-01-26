"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    score: { type: Number, required: true, default: 0 },
    coverPicture: { type: String, required: true },
    url: { type: String, required: true }
}, { timestamps: true });
const Movie = mongoose_1.model("Movie", movieSchema);
exports.default = Movie;
