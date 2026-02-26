const Camp = require('../models/Camp')
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const { sendCampMail } = require("../utils/sendCampMail");

const createCamp = async (req, res) => {
    try {
        const { village, city, state, pincode, campDate, startTime, endTime, assignedDoctor } = req.body
        console.log("AssignedDoc", assignedDoctor)

        if (!village || !city || !state || !pincode || !campDate || !startTime || !endTime || !assignedDoctor)
            return res.status(400).send({ success: false, message: "All fields are mandatory" })

        const createCamp = {
            location: {
                village: village,
                city: city,
                state: state,
                pincode: pincode,
            },
            campDate: campDate,
            startTime: startTime,
            endTime: endTime,
            assignedDoctors: assignedDoctor
        }

        const newData = await Camp(createCamp)

        const saveData = await newData.save()

        // Find patients in this location
        const patients = await Patient.find({
            "location.village": village,
            "location.city": city,
            "location.state": state,
            "location.pincode": pincode
        }).populate("userId", "email fullname");

        // ================== SEND MAIL TO ALL ==================
        let sendNotify;
        for (let p of patients) {
            sendNotify = await sendCampMail(
                p.userId.email,
                p.userId.fullname,
                saveData
            );
        }

        if (!saveData || !sendNotify)
            return res.status(404).json({ success: false, message: "Camp Data or Notify not send not Saved" })
        return res.status(200).json({
            success: true,
            message: `Camp created and ${patients.length} patients notified`
        });

    }
    catch (err) {
        console.log("Error in Create camp:", err)
        return res.send({ success: false, message: 'Trouble in Create camp! Please contact support Team.' })
    }
}


const getAllCamps = async (req, res) => {
    try {
        const fetchCamp = await Camp.find().populate({
            path: 'assignedDoctors',
            populate: {
                path: 'userId',
                select: 'fullname contact'
            }
        }).populate('patientsVisited')

        if (!fetchCamp)
            return res.status(404).json({ success: false, message: "There is No camp data" })

        return res.status(200).json({ success: true, messae: "All camp detail fetch Successfully", camp: fetchCamp })

    }
    catch (err) {
        console.log("Error in  all Get camp:", err)
        return res.send({ success: false, message: 'Trouble in all Get camp! Please contact support Team.' })
    }
}

const getCamp = async (req, res) => {
    try {
        const campID = req.params.id

        if (!campID)
            return res.status(400).json({ success: false, meassage: "ID is missing" })

        const fetchCamp = await Camp.findOne({ _id: campID }).populate({
            path: 'assignedDoctors',
            populate: {
                path: 'userId',
                select: 'fullname contact'
            }
        }).populate('patientsVisited')

        if (!fetchCamp)
            return res.status(404).json({ success: false, message: "There is No camp data" })

        return res.status(200).json({ success: true, messae: "Camp Detail fetch Successfully", camp: fetchCamp })

    }
    catch (err) {
        console.log("Error in Get camp:", err)
        return res.send({ success: false, message: 'Trouble in Get camp! Please contact support Team.' })

    }
}

const editCamps = async (req, res) => {
    try {
        const campID = req.params.id

        if (!campID)
            return res.status(400).json({ success: false, meassage: "ID is missing" })

        const { village, city, state, pincode, campDate, startTime, endTime, assignedDoctor, status, patientsVisit } = req.body

        const fetchCamp = await Camp.findOne({ _id: campID })

        if (!fetchCamp)
            return res.status(404).json({ success: false, message: "There is No camp data" })

        let editCamp = {};

        if (village) editCamp["location.village"] = village;
        if (city) editCamp["location.city"] = city;
        if (state) editCamp["location.state"] = state;
        if (pincode) editCamp["location.pincode"] = pincode;

        if (campDate) editCamp.campDate = campDate;
        if (startTime) editCamp.startTime = startTime;
        if (endTime) editCamp.endTime = endTime;
        if (assignedDoctor) editCamp.assignedDoctor = assignedDoctor;

        if (status) editCamp.status = status

        if (patientsVisit) editCamp.patientsVisited = [patientsVisit]

        const updateData = await Camp.updateOne({ _id: fetchCamp._id }, { $set: editCamp })

        if (!updateData)
            return res.status(404).json({ success: false, message: "There is no such Camp data change in the Server" })

        return res.status(200).json({ success: true, message: "Camp Data succesfully Edited." })
    }
    catch (err) {
        console.log("Error in Edit camp:", err)
        return res.send({ success: false, message: 'Trouble in Edit camp! Please contact support Team.' })
    }
}



module.exports = { createCamp, getCamp, getAllCamps, editCamps }