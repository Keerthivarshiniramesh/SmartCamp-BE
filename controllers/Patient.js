const User = require('../models/User')
const Patient = require('../models/Patient')


const createPatient = async (req, res) => {
    try {
        const { age, gender, bloodgrp, height, village, city, state, pincode } = req.body

        if (!age || !gender || !height || !village || !city || !state || !pincode)
            return res.status(400).send({ success: false, message: "All fields are mandatory" })

        const lastPatient = await Patient.findOne({}).sort({ id: -1 })

        let lastId = lastPatient ? lastPatient.id + 1 : 1

        const createPatient = {
            id: lastId,
            userId: req.session.user._id,
            age,
            gender,
            bloodGroup: bloodgrp,
            height,
            location: {
                village: village,
                city: city,
                state: state,
                pincode: pincode
            }
        }

        const newData = await Patient(createPatient)

        const saveData = await newData.save()

        if (!saveData)
            return res.status(404).json({ success: false, message: "Patient Data not Saved" })
        return res.status(200).json({ success: true, message: "Patient Data Saved Successfully" })


    }
    catch (err) {
        console.log("Error in Create Patient:", err)
        return res.send({ success: false, message: 'Trouble in Create Patient! Please contact support Team.' })
    }
}

const getPatient = async (req, res) => {
    try {

        const patientID = req.session.user.role === 'doctor' ? req.query.id : req.session.user._id 

        if (!patientID)
            return res.status(400).json({ success: false, meassage: "ID is missing" })

        const fetchPatient = await Patient.findOne({ userId: patientID }).populate('userId')

        if (!fetchPatient)
            return res.status(404).json({ success: false, message: "There is no such Patient data in the Server" })

        return res.status(200).json({ success: true, message: "Patient data found", patientData: fetchPatient })
    }

    catch (err) {
        console.log("Error in Fetch Patient:", err)
        return res.send({ success: false, message: 'Trouble in Fetch Patient! Please contact support Team.' })
    }
}

const getAllPatient = async (req, res) => {
    try {
        const { search } = req.query;
console.log(search)
        let query = {};
        if (search) {
            const users = await User.find({
                $or: [
                    { fullname: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select('_id');

            const userIds = users.map(u => u._id);

            query = { userId: { $in: userIds } };
        }

        const fetchPatient = await Patient.find(query).populate('userId');
        console.log(fetchPatient);
        if (!fetchPatient)
            return res.status(404).json({ success: false, message: "There is no such Patient data in the Server" })
        return res.status(200).json({
            success: true,
            patientData: fetchPatient
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
};



const editPatient = async (req, res) => {
    if (req.session.user.role !== 'patient')
        return res.status(400).json({ success: false, meassage: "Authorize Person can be access" })


    const patientID = req.session.user._id

    if (!patientID)
        return res.status(400).json({ success: false, meassage: "ID is missing" })

    const { age, gender, bloodgrp, height, village, city, state, pincode } = req.body

    const fetchPatient = await Patient.findOne({ userId: patientID }).populate('userId')

    if (!fetchPatient)
        return res.status(404).json({ success: false, message: "There is no such Patient data in the Server" })


    const editData = {}

    if (age) editData.age = age
    if (gender) editData.gender = gender
    if (bloodgrp) editData.bloodGroup = bloodgrp
    if (height) editData.height = height
    // ✅ Correct nested update
    if (village) editData["location.village"] = village
    if (city) editData["location.city"] = city
    if (state) editData["location.state"] = state
    if (pincode) editData["location.pincode"] = pincode

    const updateData = await Patient.updateOne({ userId: patientID }, { $set: editData })

    if (!updateData)
        return res.status(404).json({ success: false, message: "There is no such Patient data change in the Server" })

    return res.status(200).json({ auccess: true, message: "Patient Data succesfully Edited." })
}



module.exports = { createPatient, getPatient, editPatient, getAllPatient }