import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try{
    await connectDB();
    app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);    
}); }
catch(error){
    console.log("Failed to start server:", {
        message:error.message,
        stack:error.stack
    });
    process.exit(1);
}
};
startServer();
