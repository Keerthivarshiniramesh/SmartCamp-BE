const Prescription = require('../models/Prescription')

const createPrescription = async (req, res) => {
    try {
        const { patient, weight, hr, bp, spo2, caseHistoy, diagnosis, medicines, campId } = req.body

        if (!patient || !weight || !hr || !bp || !spo2 || !caseHistoy || !campId)
            return res.status(400).send({ success: false, message: "All fields are mandatory" })


        const createPrescription = {
            patientDetail: patient,
            weight, hr,
            spo2, caseHistoy,
            campId,
            precripedBy: {
                id: req.session.user._id,
                name: req.session.user.fullname,
                email: req.session.user.email,
                contact: req.session.contact
            }
        }
        if (diagnosis) createPrescription.diagnosis = diagnosis
        if (medicines) createPrescription.medicines = medicines

        const newPrescription = await Prescription(createPrescription)

        const savePrescription = await newPrescription.save()

        if (!savePrescription)
            return res.status(400).send({ success: false, message: "Prescription Data not be stored" })

        return res.status(200).send({ success: true, message: "Prescription Data stored Successfully" })

    }
    catch (err) {
        console.log("Error in Create Prescription Details:", err)
        return res.send({ success: false, message: 'Trouble in Create Prescription! Please contact support Team.' })
    }
}

const getPrescription = async (req, res) => {
    try {
        const patientId = req.params.id

        if (!patientId)
            return res.status(400).json({ success: false, meassage: "ID is missing" })

        const fetchHistory = await Prescription.find({ patientDetail: patientId })
            .populate({
                path: "campId",
                select: "location campDate"
            }).populate('patientDetail')
            .sort({ createdAt: -1 });


        if (!fetchHistory)
            return res.status(400).json({ success: false, message: "There is no such History of this Patient" })

        return res.status(200).json({ success: true, patientHstory: fetchHistory, message: "History of this Patient" })
    }
    catch (err) {
        console.log("Error in Fetch Prescription Details:", err)
        return res.send({ success: false, message: 'Trouble in Create Prescription! Please contact support Team.' })
    }
}

module.exports = { createPrescription, getPrescription }