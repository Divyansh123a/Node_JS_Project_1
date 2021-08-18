var express  = require('express');
var routes  = require('./routes');
var http  = require('http');
var path  = require('path');
var urlencoded  = require('url');
var bodyParser  = require('body-parser');
var json  = require('json');
var logger  = require('logger');
var methodOverride  = require('method-override');
var nano  = require('nano')('http://Divyansh:DivArt143!@localhost:5984');
var db = nano.use('address');
var app = express();
app.set('port' , process.env.PORT || 3000);
app.set('views' , path.join(__dirname , 'views'));
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));
app.get('/',routes.index);
app.post('/createdb' , function(req , res)
{
    nano.db.create(req.body.dbname , function(err)
    {
        if(err)
        {
            res.send('Error creation Databse'+req.body.dbname);
            return;
        }
        res.send('Databse'+req.body.dbname+'Created Succexssfully');
    });
});
app.post('/new_contact', function(req , res)
{
    var name = req.body.name;
    var phone  = req.body.phone;

    db.insert({name:name , phone:phone , crazy:true}, phone , function(err,body,header)
    {
         if(err)
         {
             res.send('Error in contact creation');
             return;
         }
         res.send('Contact Created Successfully');
    });
});
app.post('/view_contact' , function(req , res)
{
    var alldoc = "Allowing are the contact";
    db.get(req.body.phone, {revs_info:true}, function(err,body)
    {
        if(!error)
        {
            console.log(body);
        }

        if(body)
        {
            alldoc+="Name "+body.name+"<br/>Phone No"+body.phone;
        }
        else
        {
            alldoc+="No records fouhnd";
        }
        res.send(alldoc);
    });
});
app.post('/delete_contact' , function(req,res)
{
    db.get(req.body.phone , {revs_info:true} , function(err , body)
    {
        if(!err)
        {
            db.destroy(req.body.phone , body._rev, function(err , body)
            {
                if(err)
                {
                    res.send('Error in deleting contact');
                }
                res.send('Contacts Deleted successfully');
            });
        }
    });
});
http.createServer(app).listen(app.get('port'), function()
{
    console.log('Express Server listning on port'+app.get('port'));
})