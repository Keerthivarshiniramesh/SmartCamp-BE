const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    id: { type: Number, required: true, trim: true },
    userId: {type:mongoose.Schema.Types.ObjectId, ref:'users'},
    specialist: { type: String, required: true, trim: true },
    hospitalName: { type: String, required: true },
    branch: { type: String, trim: true },
    location: { type: String, trim: true },
    experience: { type: Number, required: true }, // years of experience
    campsAssigned: [
        {
            type: String, trim: true
        }
    ],
},
    {
        timestamps: true
    })

const doctorModel = mongoose.model('Doctor',doctorSchema)
module.exports = doctorModel