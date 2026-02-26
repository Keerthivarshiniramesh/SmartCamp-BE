const User = require('../models/User')
const Doctor = require('../models/Doctor')


const createDoctor = async (req, res) => {
    try {
        const { specialist, hospitalName, branch, location, experience } = req.body
        console.log(specialist, hospitalName, branch, location, experience)

        if (!specialist || !hospitalName || !location || !experience)
            return res.status(400).send({ success: false, message: "All fields are mandatory" })

        const lastDoctor = await Doctor.findOne({}).sort({ id: -1 })

        let lastId = lastDoctor ? lastDoctor.id + 1 : 1

        const createData = {
            id: lastId,
            userId: req.session.user._id,
            specialist,
            hospitalName,
            location,
            experience
        }

        if (branch) createData.branch = branch

        const newData = await Doctor(createData)

        const saveData = await newData.save()

        if (!saveData)
            return res.status(404).json({ success: false, message: "Doctor Data not Saved" })
        return res.status(200).json({ success: true, message: "Doctor Data Saved Successfully" })


    }
    catch (err) {
        console.log("Error in Create Doctor:", err)
        return res.send({ success: false, message: 'Trouble in Create Doctor! Please contact support Team.' })
    }
}

const getDoctor = async (req, res) => {
    try {
        if (req.session.user.role !== 'doctor')
            return res.status(400).json({ success: false, meassage: "Authorize Person can be access" })


        const doctorID = req.session.user._id

        if (!doctorID)
            return res.status(400).jsn({ success: false, meassage: "ID is missing" })

        const fetchDoctor = await Doctor.findOne({ userId: doctorID }).populate('userId')

        if (!fetchDoctor)
            return re.status(404).json({ success: false, message: "There is no such Doctor data in the Server" })

        return res.status(200).json({ success: true, message: "Doctor data found", doctorData: fetchDoctor })
    }

    catch (err) {
        console.log("Error in Fetch Doctor:", err)
        return res.send({ success: false, message: 'Trouble in Fetch Doctor! Please contact support Team.' })
    }
}

const getAllDoctor = async (req, res) => {
    try {
        

        const fetchDoctor = await Doctor.find().populate('userId')

        if (!fetchDoctor)
            return re.status(404).json({ success: false, message: "There is no such Doctor data in the Server" })

        return res.status(200).json({ success: true, message: "Doctor data found", doctorData: fetchDoctor })
    }

    catch (err) {
        console.log("Error in Fetch Doctor:", err)
        return res.send({ success: false, message: 'Trouble in Fetch Doctor! Please contact support Team.' })
    }
}


const editDoctor = async (req, res) => {
    console.log("It calls")
    if (req.session.user.role !== 'doctor')
        return res.status(400).json({ success: false, meassage: "Authorize Person can be access" })


    const doctorID = req.session.user._id

    if (!doctorID)
        return res.status(400).jsn({ success: false, meassage: "ID is missing" })

    const { specialist, hospitalName, branch, location, experience } = req.body

    const fetchDoctor = await Doctor.findOne({ userId: doctorID })

    if (!fetchDoctor)
        return res.status(404).json({ success: false, message: "There is no such Doctor data in the Server" })


    const editData = {}

    if (specialist) editData.specialist = specialist
    if (hospitalName) editData.hospitalName = hospitalName
    if (branch) editData.branch = branch
    if (location) editData.location = location
    if (experience) editData.experience = experience

    const updateData = await Doctor.updateOne({ userId: doctorID }, { $set: editData })

    if (!updateData)
        return res.status(404).json({ success: false, message: "There is no such Doctor data change in the Server" })

    return res.status(200).json({ auccess: true, message: "Doctor Data succesfully Edited." })
}



module.exports = { createDoctor, getDoctor, editDoctor, getAllDoctor }