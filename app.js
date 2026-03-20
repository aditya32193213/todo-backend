import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Todo App!' });
});
app.use('/api', routes);
app.use((req,res ,next)=>{
    const error = new Error("Route not Found");
    error.statusCode = 404;
    next(error);
})
app.use(errorHandler);
export default app;