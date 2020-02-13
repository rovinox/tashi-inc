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
    console.log(id,name);
    try{
        const student = {
            
            user_id: parseInt(id),
            email: "gghhh@gmail.com",
            password: "$2a$08$cJwAuK4ter0PrjRdaYTVgu2nW0uyj9H8aT0gtMpWK4XRmM42PzjDC",
            first_name: name,
            last_name: "sjdnvjkdvn",
            question1: null,
            question2: null,
            question3: null,
            answer1: null,
            answer2: null,
            answer3: null,
            image: null,
        }
     res.status(200).json(student);
        // const db = req.app.get("db")
        // const allStudents = await db.Change_name(name, id)
        // res.status(200).json(allStudents)
        // console.log(allStudents);
    } catch(err){
       console.log(err);
    }
    })     


app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
});


app.listen(SERVER_PORT, ()=> console.log(`linting on ${SERVER_PORT}`))