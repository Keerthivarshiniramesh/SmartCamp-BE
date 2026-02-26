const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
   
    patientDetail: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    weight: { type: String, trim: true },
    hr: { type: String, trim: true },
    bp: { type: String, trim: true },
    spo2: { type: String, trim: true },
    caseHistory: { type: String, trim: true },
    diagnosis: { type: String, trim: true },
    medicines: { type: String, trim: true },
    precripedBy: {
        id: { type: String },
        name: { type: String },
        email: { type: String },
        contact :{type:String}
    },
    campId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camp',
        required: true
    },
   

}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
