const express = require('express');

const app = express();



app.use("/test",(req,res)=>{
    res.send("Hello I am Piyush Patil")
})
app.get("/user",(req,res)=>{
    res.send({firstName:"Piyush",
        lastName: "Patil"
    })
})

app.post("/user",(req,res)=>{
    console.log("Save Data to the database");
    res.send("Data Succesfully saved to database.");
})

app.delete("/user",(req,res)=>{
    console.log("Data is being Deleted");
    res.send("Deleted.")
})

app.put("/user",(req,res)=>{
    console.log("User name changed.");
    res.send("User Updated")
})
app.patch("/user",(req,res)=>{
    console.log("User name patched.");
    res.send("User Patched")
})

app.listen(3000,()=>{
    console.log("Server is running on Port 3000.")
})