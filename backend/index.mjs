import express from 'express';
import { connectDB } from './db.mjs';
import sendStandard from './routes/sendStandard.mjs'
import history from './routes/history.mjs'
import cors from 'cors'
const app = express();
const PORT = 8000;

//connect db
connectDB();
//middleware
app.use(cors()); //Used to connect to another port.
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/', sendStandard); //http://localhost:8000/standard
app.use('/', history);  //http://localhost:8000/history

app.listen(PORT,()=>{
    console.log(`Server is listening on http://localhost:${PORT}`)
})