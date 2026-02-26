const mongoose = require('mongoose')

const patientSchema = mongoose.Schema({
    id: { type: Number, required: true, trim: true },
    userId: {type:mongoose.Schema.Types.ObjectId, ref:'users'},
    age: { type: Number, required: true, trim: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, trim: true },
    height: { type: String, trim: true },
    location: {
        village: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true }
    }
},
    {
        timestamps: true
    })

const patientModel = mongoose.model('Patient',patientSchema )
module.exports = patientModel