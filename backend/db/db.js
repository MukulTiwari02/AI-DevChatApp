import mongoose from "mongoose";

const connect = () => {
    mongoose.connect(process.env.MONGO_URI).then( () => {
        console.log("Connected to mongodb")
    }).catch(e => {
        console.log(e.message)
    })
}

export default connect;