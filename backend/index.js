const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://saaisajith11:saaidb@cluster0.8phdv.mongodb.net/passkey?retryWrites=true&w=majority").then(function () {
    console.log("connected to DB")
}).catch(function (err) {
    console.log("failed to connect to DB",err.message)
})

const credentials = mongoose.model("credentials", {}, "bulkmail")







app.post("/sendemail", function (req, res) {

    var emailmessage = req.body.emailmsg
    var emailList = req.body.listofemail

    credentials.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            }
        }
        )
        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: "saaisajith11@gmail.com",
                        to: emailList[i],
                        subject: "Bulkmail Practice",
                        text: emailmessage
                    })
                    console.log("Email sent to:" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("fail")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })



    }).catch(function (error) {
        console.log(error)
    })
}

)

app.listen(5000, function () {
    console.log("Server started...")
})