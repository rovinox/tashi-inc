require("dotenv").config()
const express = require("express")
const massive = require("massive")
const session = require("express-session")



const app = express()
app.use(express.json())
app.use( express.static( `${__dirname}/../build` ) );


const {SERVER_PORT, CONNECTING_STRING, SECRET} = process.env


massive(CONNECTING_STRING).then(db => {
    app.set("db", db)
    console.log("Database Connected");
}).catch(err => console.log(err))

app.use(session({
    secret:SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }

}))


app.get("/api/students", async (req, res) =>{
     try{

         const db = req.app.get("db")
         const allStudents = await db.Get_All_Students()
         res.status(200).json(allStudents)
     } catch(err){
        console.log(err);
     }
     })


app.put("/api/changestudent/:id", async (req, res) =>{
    const {id} = req.params
    const {name} = req.body
    try{
        const db = req.app.get("db")
        const newName = await db.Change_name(name, id)
        res.status(200).json(newName)
        
    } catch(err){
       console.log(err);
    }
    })     


app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
});


app.listen(SERVER_PORT, ()=> console.log(`linting on ${SERVER_PORT}`))