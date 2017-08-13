var changetagflag = 0;
var count = 0;

// uploads an image within a form object.  This currently seems
// to be the easiest way to send a big binary file.
function uploadFile() {
    var image = document.getElementById('theImage'+count);

    var url = "http://138.68.25.50:6521";

    // where we find the file handle
    var selectedFile = document.getElementById('fileSelector').files[0];
    var formData = new FormData();
    // stick the file into the form
    formData.append("userfile", selectedFile);

    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so
    // it is often omitted; it means do the upload
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed.
    oReq.open("POST", url, true);
    oReq.onload = function() {
        // the response, in case we want to look at it
        image.style.opacity = 1.0;

        var labelarray = JSON.parse(oReq.responseText);
        var length = labelarray.labelAnnotations.length;


        for ( var i =0; i<length; i++)
        {
             var tagName = labelarray.labelAnnotations[i].description;

             //console.log(count);
             autoreadTag(globalfile, count-1,tagName);
             autosendTag(globalfile, count-1,tagName);


        }
    }
    oReq.send(formData);
    count++;
}

var globalfile;

function readFile() {
    var selectedFile = document.getElementById('fileSelector').files[0];

    var selectedFileName = $('#fileSelector').val().split('\\').pop();
globalfile = selectedFileName;
    //create a new img tag in html
    $(".image-container").prepend("<div id='block"+count+"' class='blockClass'></div>");
    var temp = "#block"+count;
    $(temp).append("<div id='imgblockout"+count+"' class = 'imgblockoutClass'></div>");
    $(temp).append("<div id='tagblockout"+count+"' class = 'tagblockoutClass'></div>");
    $(temp).append("<div id='tagblockbelow"+count+"' class = 'tagblockbelowClass'></div>");

    var temp2 = "#imgblockout"+count;
    $(temp2).append("<div id='imgblockin"+count+"' class = 'imgblockinClass'></div>");
    var temp3 = "#imgblockin"+count;
    $(temp3).append("<img id='theImage"+count+"'/>");
    $(temp3).append("<div id='option"+count+"' class = 'optionClass'></div>");

    var temp4 = "#option"+count;

    $(temp4).append("<input type='image' class='iconclass' id='theIcon"+count+"'/>");

//option/fav section
    $(temp4).append("<div id='changetagblock"+count+"' class = 'changetagclass'></div>");
    $(temp4).append("<div id='favblock"+count+"' class = 'favclass'></div>");
    $(temp4).append("<div id='unfavblock"+count+"' class = 'unfavclass'></div>");
    $(temp4).append("<div id='inneropt"+count+"' class = 'inneroptclass'></div>");

    var change = "#changetagblock"+count;
    var fav = "#favblock"+count;
    var unfav = "#unfavblock"+count;
    var inner = "#inneropt"+count;
    $(change).append("<input type='button' class='button' value ='change tags' onclick='changethetag("+count+")' id='changetags"+count+"'/>");
    $(fav).append("<input type='button' class='button' value ='add to favorites' id='addfav"+count+"'/>");
    $(unfav).append("<input type='button' class='button' value ='unfavorite' id='unfav"+count+"'/>");
    $(inner).append("<input type='image' class='button' id='innerIcon"+count+"'/>");

    var innericon = document.getElementById('innerIcon' + count);
    var myfav = document.getElementById('addfav' + count);
    var unfav = document.getElementById('unfav' + count);
    var mychange = document.getElementById('changetags' + count);
    innericon.src = "./photobooth/optionsTriangle.png";
    innericon.style.display =  "none";
    myfav.style.display="none";
    unfav.style.display="none";
    mychange.style.display="none";

//tag section
    var temp5 = "#tagblockbelow"+count;
    $(temp5).append("<input type='text' class='tagSelector' id='tagSelector"+count+"'>");
    $(temp5).append("<button class='addButton' id='addButton"+count+"' >Add</button>");

    var image = document.getElementById('theImage' + count);
    image.alt = selectedFileName;

    var icon = document.getElementById('theIcon' + count);

    var add = document.getElementById('addButton' + count);

    var fr = new FileReader();
    // anonymous callback uses file as image source
    fr.onload = function () {
        image.src = fr.result;
        image.style.opacity = 0.5;
        icon.src = "./photobooth/optionsTriangle.png";
        icon.style.opacity = 1;
    };
    add.onclick = (function() {
      var num = count;
      console.log("add:"+selectedFileName+", "+num);
      return function() {
                        console.log("readfile filename: "+selectedFileName);
                        readTag(selectedFileName, num); sendTag(selectedFileName, num);
                        }
    })();

    icon.onclick = (function() {
                var iconnum = "theIcon"+count;
                var imagenum = "theImage"+count;
                var mycount =count;
                console.log("my count:"+count);
                return function() {
                showMenu(iconnum, imagenum,mycount);
                }
                })();

    fr.readAsDataURL(selectedFile);    // begin reading
}

function display_img()
{

   alert("Image is loaded");
    var url = "http://138.68.25.50:6521/query?op=dump";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url);
    oReq.onload = function()
    {
      //  console.log("back to call back");
   //     console.log(oReq.responseText);
        var dataArray = JSON.parse(oReq.responseText);
        if (dataArray.length > 0)
        {
            addPhotosToDOM(dataArray);
        }
    };
    oReq.send();


}
function addPhotosToDOM(dataArray)
{
    alert("try to add photo");
// //   console.log(dataArray[0].fileName);
    var mylength = (dataArray.length);
    console.log(mylength);

    //create a new img tag in html
    for (count=0;count<mylength;count++)
    {
        console.log("file:"+dataArray[count].fileName);
        var source = dataArray[count].fileName;

        $(".image-container").prepend("<div id='block"+count+"' class='blockClass'></div>");
        var temp = "#block"+count;
        $(temp).append("<div id='imgblockout"+count+"' class = 'imgblockoutClass'></div>");
        $(temp).append("<div id='tagblockout"+count+"' class = 'tagblockoutClass'></div>");
        $(temp).append("<div id='tagblockbelow"+count+"' class = 'tagblockbelowClass'></div>");

        var temp2 = "#imgblockout"+count;
        $(temp2).append("<div id='imgblockin"+count+"' class = 'imgblockinClass'></div>");
        var temp3 = "#imgblockin"+count;
        $(temp3).append("<img id='theImage"+count+"'/>");
        $(temp3).append("<div id='option"+count+"' class = 'optionClass'></div>");
        var temp4 = "#option"+count;
        $(temp4).append("<input type='image' class='iconclass' id='theIcon"+count+"'/>");

//option/fav section
        $(temp4).append("<div id='changetagblock"+count+"' class = 'changetagclass'></div>");
        $(temp4).append("<div id='favblock"+count+"' class = 'favclass'></div>");
        $(temp4).append("<div id='unfavblock"+count+"' class = 'unfavclass'></div>");
        $(temp4).append("<div id='inneropt"+count+"' class = 'inneroptclass'></div>");
        var change = "#changetagblock"+count;
        var fav = "#favblock"+count;
        var unfav = "#unfavblock"+count;
        var inner = "#inneropt"+count;
        $(change).append("<input type='button' class='button' value ='change tags' onclick='changethetag("+count+")' id='changetags"+count+"'/>");
        $(fav).append("<input type='button' class='button' value ='add to favorites' id='addfav"+count+"'/>");
        $(unfav).append("<input type='button' class='button' value ='unfavorite' id='unfav"+count+"'/>");
        $(inner).append("<input type='image' class='button' id='innerIcon"+count+"'/>");

        var innericon = document.getElementById('innerIcon' + count);
        var myfav = document.getElementById('addfav' + count);
        var unfav = document.getElementById('unfav' + count);
        var mychange = document.getElementById('changetags' + count);
        innericon.src = "./photobooth/optionsTriangle.png";
        innericon.style.display =  "none";
        myfav.style.display="none";
        unfav.style.display="none";
        mychange.style.display="none";

//tag section
        var temp5 = "#tagblockbelow"+count;
        $(temp5).append("<input type='text' class='tagSelector' id='tagSelector"+count+"'>");
        $(temp5).append("<button class='addButton' id='addButton"+count+"' >Add</button>");

        var image = document.getElementById('theImage' + count);
        var icon = document.getElementById('theIcon' + count);
        image.alt = source;
        image.src = "../"+source;
        icon.src = "./photobooth/optionsTriangle.png";

        var add = document.getElementById('addButton' + count);
        add.onclick = (function() {
          var num = count;
          var imagename = image.alt;
          console.log("dom add:"+source+", "+num);
          return function() {
                            console.log("DOM filename: "+imagename);
                            readTag(imagename, num); sendTag(imagename, num);
                            }
        })();

        icon.onclick = (function() {
                var iconnum = "theIcon"+count;
                var imagenum = "theImage"+count;
                var mycount =count;
              //  console.log("my count:"+count);
                return function() {
                showMenu(iconnum, imagenum, mycount );
                }
                })();

    /*    $(".image-container").append("<img id='theImage"+count+"'/>");
        $('theImage'+count).css("opacity", "1");
        var image = document.getElementById('theImage' + count);
        image.src = "../"+source;*/

    }
}
function unfavpic(imgName) {
    // where we find the label
 //   var label = document.getElementById('tagSelector').value;

    var url = "http://138.68.25.50:6521/query?op=unfav&img="+imgName;

    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so
    // it is often omitted; it means do the upload
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed.
    oReq.open("GET", url);
    oReq.onload = function() {
        // the response, in case we want to look at it
        console.log(oReq.responseText);
        //image.style.opacity = 1.0;
    }
    oReq.send();
}

function favpic(imgName) {
    // where we find the label
 //   var label = document.getElementById('tagSelector').value;

    var url = "http://138.68.25.50:6521/query?op=fav&img="+imgName;

    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so
    // it is often omitted; it means do the upload
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed.
    oReq.open("GET", url);
    oReq.onload = function() {
        // the response, in case we want to look at it
        console.log(oReq.responseText);
        //image.style.opacity = 1.0;
    }
    oReq.send();
}


function showMenu(iconnum, imagenum, mycount)
{

    console.log(iconnum);
    console.log(imagenum);
    console.log(mycount);

    var innericon = document.getElementById('innerIcon' + mycount);
    var myfav = document.getElementById('addfav' + mycount);
    var unfav = document.getElementById('unfav' + mycount);
    var mychange = document.getElementById('changetags' + mycount);
    var oldicon =document.getElementById(iconnum);
    oldicon.style.display = "none";
    innericon.style.display =  "inline-block";
    myfav.style.display="inline-block";
    unfav.style.display="none";
    mychange.style.display="inline-block";


    var image = document.getElementById('theImage' + mycount);
    var imgName = image.alt;
    console.log("imgname:"+imgName);

    myfav.onclick = (
      function() {
        console.log(imgName);
        return function() {
          favpic(imgName);
          myfav.style.display="none";
          unfav.style.display="inline-block";
        }
      })();
    unfav.onclick = (
      function() {
        return function() {
         unfavpic(imgName);
          unfav.style.display="none";
          myfav.style.display="inline-block";
        }
      })();
    innericon.onclick = (
      function() {
        console.log("???");
        return function() {
          oldicon.style.display = "block";
          myfav.style.display = "none";
          unfav.style.display="none";
          innericon.style.display = "none";
          mychange.style.display="none";
        }
      })();
}

//filter labels feature
function filterLabels()
{
    var labelname = document.getElementById('tagFilter').value;
    console.log("filter label:"+labelname);
    var url = "http://138.68.25.50:6521/query?op=filter&label="+labelname;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url);
    oReq.onload = function()
    {
      //  console.log("back to call back");
        console.log(oReq.responseText);
        var dataArray = JSON.parse(oReq.responseText);
        console.log(dataArray);
        $('.image-container').children().css("display","none");
        var arraylength = (dataArray.length);
        if (arraylength > 0){
          for (var i = 0; i < arraylength; i++) {
            var source = dataArray[i].fileName;
            for (var j = 0; j < count; j++) {
              console.log(source);
              console.log($('#block'+j).find('#theImage'+j).attr("alt"));
              if(source === $('#block'+j).find('#theImage'+j).attr("alt")){
                $('#block'+j).css("display","block");
              }
            }

          }

        }

    };
    oReq.send();
}

function favFilter()
{


    // var url = "http://138.68.25.50:6521/query?op=favload";
    // var oReq = new XMLHttpRequest();
    // oReq.open("GET", url);
    // oReq.onload = function()
    // {
    //     alert("onload?");
    //     //  console.log("back to call back");
    //     //     console.log(oReq.responseText);
    //     var dataArray = JSON.parse(oReq.responseText);
    // //    console.log(dataArray[0].fileName);
    //   //      var mylength = (dataArray.length);
    //    // console.log(mylength);
    //     if (dataArray.length > 0)
    //     {
    //         addPhotosToFav(dataArray);
    //     }
    //     else
    //     {
    //         alert("tf?");
    //     }
    // };
    // oReq.send();

    var url = "http://138.68.25.50:6521/query?op=favload";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url);
    oReq.onload = function()
    {
      //  console.log("back to call back");
        console.log(oReq.responseText);
        var dataArray = JSON.parse(oReq.responseText);
        console.log(dataArray);
        $('.image-container').children().css("display","none");
        var arraylength = (dataArray.length);
        if (arraylength > 0){
          for (var i = 0; i < arraylength; i++) {
            var source = dataArray[i].fileName;
            for (var j = 0; j < count; j++) {
              console.log(source);
              console.log($('#block'+j).find('#theImage'+j).attr("alt"));
              if(source === $('#block'+j).find('#theImage'+j).attr("alt")){
                $('#block'+j).css("display","block");
              }
            }

          }

        }

    };
    oReq.send();

}


function clearFilter2()
{
  $('.image-container').children().css("display","block");
}

function clearFilter()
{
  $('.image-container').children().css("display","block");
}

function changethetag(tagnum)
{
  console.log('changetag:'+changetagflag);
  if(changetagflag == 0){
    $('#tagblockout'+tagnum).find('.deleteButton').css("display","block");
    $('#tagblockbelow'+tagnum).css("display","block");
    $('#tagblockout'+tagnum).css("background","#C9B9B1");
    changetagflag = 1;
  } else if (changetagflag == 1){
    $('#tagblockout'+tagnum).find('.deleteButton').css("display","none");
    $('#tagblockbelow'+tagnum).css("display","none");
    $('#tagblockout'+tagnum).css("background-color","white");
    changetagflag = 0;
  }
}
