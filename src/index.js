import db_connect from "./db/index.js";

import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});


db_connect()
.then(() =>{
      app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running on port ${process.env.PORT || 8000}`)


      })
})
.catch((error) =>{
    console.log("error connecting database " , error)
})