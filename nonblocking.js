var fs = require('fs');
var data = fs.readFile('div.txt' , function(err , data)
{
    if(err)
    {
        console.log(err);
    }
    setTimeout(()=>{
            console.log('display after 2 second');
            console.log(data.toString());
    },2000);

});
console.log("Start Here");
