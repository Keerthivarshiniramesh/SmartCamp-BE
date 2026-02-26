const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

exports.sendCampMail = async (to, name, camp) => {
    await transporter.sendMail({
        from: `Health Camp <${process.env.MAIL_USER}>`,
        to,
        subject: "Upcoming Health Camp Near Your Location",
        html: `
            <h2>Hello ${name},</h2>
            <p>A health camp has been scheduled near your area.</p>

            <p><b>Location:</b> ${camp.location.village}, ${camp.location.city}</p>
            <p><b>Date:</b> ${camp.campDate}</p>
            <p><b>Time:</b> ${camp.startTime} - ${camp.endTime}</p>

            <p>Please visit the camp for free health checkup.</p>

            <br/>
            <p>Regards,<br/>Health Camp Team</p>
        `
    });
};
