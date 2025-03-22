import User from "../models/user.model.js";

export const createUser = async (req) =>
{
    const {email, password} = req.body;

    const userExists = await User.findOne({email: email});

    if(userExists)
            throw new Error("User already exists.")


    if(!email || !password)
        throw new Error("Email and password are required")

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
        email, password: hashedPassword
    })

    return user;
}