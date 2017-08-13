/* This server, unlike our previous ones, uses the express framework */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = require('request');
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images
var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB
var querystring = require('querystring'); // handy for parsing query strings
var url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDKllbsckFBqQy00Fut8HgQZJ-UnXAp2SE';

function errorCallback(err) {
    if (err) {
        console.log("error: ",err,"\n");
    }
}



// make a new express server object
var app = express();

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is "138.68.25.50:???/query?img=hula"
app.get('/query', function (req, response){
        console.log("query");
        query = req.url.split("?")[1]; // get query string
        if (query) {
        answer(query, response);
        } else {
        sendCode(400,response,'query not recognized');
        }
        });

// Case 3: upload images
// Responds to any POST request
app.post('/', function (req, response){
         var form = new formidable.IncomingForm();
         form.parse(req); // figures out what files are in form
         var myfile;

         // callback for when a file begins to be processed
         form.on('fileBegin', function (name, file){
                 // put it in /public
                 file.path = __dirname + '/public/' + file.name;
                 myfile = file.name;
                 console.log("uploading ",file.name,name);
                 db.run ('INSERT OR REPLACE INTO photoLabels VALUES (?, "", 0)', [file.name], errorCallback);
                 });

         // callback for when file is fully recieved
         form.on('end', function (){
                 console.log('success');
                 var labelarray;

                    var uri = "http://138.68.25.50:6521/"+myfile;
                    console.log(uri);
                    requestObject =
                    {
                       "requests":
                       [
                         {
                           "image": {
                           "source": {"imageUri": uri}
                                   },
                           "features": [{ "type": "LABEL_DETECTION" }]
                         }
                       ]
                     }

                      function APIcallback(err, APIresponse, body) {
           if ((err) || (APIresponse.statusCode != 200)) {
  console.log("Got API error");
    } else {
                APIresponseJSON = body.responses[0];
 // console.log("checking point");
  console.log(APIresponseJSON);
        console.log("checking point");

                labelarray = APIresponseJSON;

             //   console.log(labelarray);
                response.status(200);
                 response.type("text/json");
                // console.log(labelarray);
                 response.send(labelarray);
            }
        }
                     request(
                     { // HTTP header stuff
                          url: url,
                          method: "POST",
                          headers: {"content-type": "application/json"},
                          // stringifies object and puts into HTTP request body as JSON
                          json: requestObject,
                     },
                      // callback function for API request

                      APIcallback
                    );

                  //AIzaSyDKllbsckFBqQy00Fut8HgQZJ-UnXAp2SE for API key




                  //sendCode(201,labelarray,'recieved file');  // respond to browser
                 });


         });

// You know what this is, right?
app.listen(6521);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}

//

// function APIcallback(err, APIresponse, body) {
//     if ((err) || (APIresponse.statusCode != 200)) {
//   console.log("Got API error");
//     } else {
//   APIresponseJSON = body.responses[0];
//  // console.log("checking point");
//   console.log(APIresponseJSON);
//         console.log("checking point");

//                 labelarray = APIresponseJSON;
//                 console.log(labelarray);

//     }
// }

// Stuff for dummy query answering
// We'll replace this with a real database someday!
function answer(query, response) {

    queryObj = querystring.parse(query);
    if (queryObj.op=="dump"){
        console.log("dumping?");
        db.all('SELECT * FROM photoLabels',dumpdataCallback); // dumping whole db back

        function dumpdataCallback(err, tableData) {
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                console.log("got: ",tableData,"\n");
                response.status(200);
                response.type("text/json");
                var dbarray = tableData;
                response.send(dbarray);
            }
        }
    }

    // query looks like: op=add&img=[image filename]&label=[label to add]
    else if (queryObj.op == "add") {
        console.log("add?");
        var newLabel = queryObj.label;
        var imageFile = queryObj.img;
        console.log(newLabel);
        console.log(imageFile);

        if (newLabel && imageFile) {
            // good add query
            // go to database!
            //db.serialize(function() {
            db.get(
                   'SELECT labels FROM photoLabels WHERE fileName = ?',
                   [imageFile], addCallback);
            //});
            // callback for db.get
            // defined inside answer so it knows about imageFile
            // because closure!
            function addCallback(err,data) {
                console.log("getting labels from "+imageFile);
                console.log(data.labels);
                if (err) {
                    console.log("error: ",err,"\n");
                } else {
                      //db.serialize( function (){
                    if (data.labels === "")
                    {
                        console.log("detect null");
                        db.run(
                               'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
                               [newLabel, imageFile],
                               addupdateCallback);
                    }
                    else{
                        console.log("not null");
                        // good response...so let's update labels
                        db.run(
                               'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
                               [data.labels+", "+newLabel, imageFile],
                               addupdateCallback);
                    }
                  //});
                }
            }

            // callback for db.run('UPDATE ..')
            // Also defined inside answer so it knows about
            // response object
            function addupdateCallback(err) {
                console.log("updating labels for "+imageFile+"\n");
                if (err) {
                    console.log(err+"\n");
                    sendCode(400,response,"requested photo not found");
                } else {
                    // send a nice response back to browser
                    sendCode(200,response,"added label "+newLabel+
                             " to "+imageFile);
                    console.log("success update");
                }
            }


        }

    }


    else if (queryObj.op == "filter"){
      // query looks like: op=filter&label=[filter label]
      console.log("filter?");
      var filterLabel = queryObj.label;

      console.log(filterLabel);

      if (filterLabel) {
        db.all(
          'SELECT fileName FROM photoLabels WHERE labels LIKE ?',
          ['%'+filterLabel+'%'], filterAllCallback);

        function filterAllCallback(err, tableData) {
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                console.log("got filenames: ",tableData,"\n");
                response.status(200);
                response.type("text/json");
                var dbarray = tableData;
                response.send(dbarray);
            }
        }

      }
    }

    else if(queryObj.op=="fav")
    {
        console.log("faving?");
        var imageFile = queryObj.img;
        db.get(
               'SELECT favorite FROM photoLabels WHERE fileName = ?',
               [imageFile], favCallback);

        function favCallback(err,data) {
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                db.run(
                       'UPDATE photoLabels SET favorite = ? WHERE fileName = ?',
                       [1, imageFile],
                       favupdateCallback);
            }
        }
        function favupdateCallback(err) {
            if (err) {
                console.log(err+"\n");
                sendCode(400,response,"requested photo not found");
            } else {
                // send a nice response back to browser
                sendCode(200,response,"Favorite "+imageFile);
                console.log("success update");
            }
        }


    }

    else if(queryObj.op=="unfav")
    {
        console.log("unfaving?");
        var imageFile = queryObj.img;
        db.get(
               'SELECT favorite FROM photoLabels WHERE fileName = ?',
               [imageFile], unfavCallback);

        function unfavCallback(err,data) {
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                db.run(
                       'UPDATE photoLabels SET favorite = ? WHERE fileName = ?',
                       [0, imageFile],
                       unfavupdateCallback);
            }
        }
        function unfavupdateCallback(err) {
            if (err) {
                console.log(err+"\n");
                sendCode(400,response,"requested photo not found");
            } else {
                // send a nice response back to browser
                sendCode(200,response,"Un-favorite "+imageFile);
                console.log("success update");
            }
        }


    }



    else if (queryObj.op=="favload"){
        console.log("favload?");
        db.all('SELECT fileName FROM photoLabels WHERE favorite = ?',
               1, favloadCallback);

        function favloadCallback(err, tableData) {
            if (err) {
                console.log("error: ",err,"\n");
            } else {
                console.log("got: ",tableData,"\n");
               response.status(200);
               response.type("text/json");
                var dbarray = tableData;
               response.send(dbarray);
            }
        }
    }

    else if (queryObj.op == "delete"){
      // query looks like: op=delete&img=[image filename]&label=[label to add]
      console.log("delete?");
      var deleteLabel = queryObj.label;
      var imageFile = queryObj.img;
      console.log(deleteLabel);
      console.log(imageFile);
      if (deleteLabel && imageFile) {
        // good add query
        // go to database!
        db.get(
          'SELECT labels FROM photoLabels WHERE fileName = ?',
          [imageFile], getCallback1);

        // callback for db.get
        // defined inside answer so it knows about imageFile
        // because closure!
        function getCallback1(err,data) {
          console.log("getting labels from "+imageFile);
          console.log(data.labels);
          if (err) {
              console.log("error: ",err,"\n");
          } else {

              console.log("not null");
              // good response...so let's update labels
              data.labels = data.labels.replace(deleteLabel,"");
              db.run(
            'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
            [data.labels, imageFile],
            updateCallback1);
          }
        }

        // callback for db.run('UPDATE ..')
        // Also defined inside answer so it knows about
        // response object
        function updateCallback1(err) {
          console.log("updating labels for "+imageFile+"\n");
          if (err) {
              console.log(err+"\n");
              sendCode(400,response,"requested photo not found");
          } else {
              // send a nice response back to browser
              sendCode(200,response,"deleted label "+deleteLabel+
                 " from "+imageFile);
		          console.log("success update");
          }
        }

      }
    }


    else
    {
         console.log("else");
    }


}
