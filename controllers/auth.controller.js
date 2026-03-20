import  { registerUserService ,loginUserService } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
    try {
        const {name, email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await registerUserService({ name, email, password });
        res.status(201).json({ success: true,message: "User registered successfully", user });

    } catch (error) {
        next(error);
    }
};
    
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await loginUserService({ email, password });
        res.status(200).json({ success: true, message: "User logged in successfully", user });
    } catch (error) {
        next(error);
    }
};