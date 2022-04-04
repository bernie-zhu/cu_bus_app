const express = require('express');
const bodyParser = require('body-parser');
var connection  = require('express-myconnection');
var mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

app.use(

        connection(mysql,{

            host: '34.134.85.82', //'localhost',
            user: 'hello',
            password : '1234',
            //port : 3306, //port mysql
            database:'uiucbuses'

        },'pool')); //or single

       app.post('/add_user',(req,res)=>{

        let {Username,Password,} = req.body;


        if(!Username) return res.status(400).json('Username cant be blank');
        if(!Password) return res.status(400).json('Password cant be blank');

        var data={Username:Username,
                  Password:Password};


         var query = connection.query("INSERT INTO Users set ? ",data,
        function(err, rows)
        {

          if (err){
            //If error
              res.status(400).json('Sorry!!Unable To Add');
              console.log("Error inserting : %s ",err );
             }
         else
          //If success
          res.status(200).json('User Added Successfully!!')

        });


        });


         app.listen(3000, ()=> {
      console.log(`app is running on port 3000`);
});
