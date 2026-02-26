const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
    location: {
        village: [{ type: String, trim: true }],
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true }
    },

    campDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    assignedDoctors: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        }
    ,

    patientsVisited: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient"
        }
    ],

    status: {
        type: String,
        enum: ["upcoming", "completed", "cancelled"],
        default: "upcoming"
    }

}, { timestamps: true });

module.exports = mongoose.model("Camp", campSchema);
