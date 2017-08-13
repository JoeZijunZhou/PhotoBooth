var tcount = 0;
//display the tag in the web page
function readTag(filename, count) {
    console.log("read:"+filename+","+count);
    var getTag = document.getElementById('tagSelector'+count).value;
    //var getTag = $(this).parent().find('input').value;
    //var tagContainer = $(this).parent();

    //create a new img tag in html
    $('#tagblockout'+count).append("<div class='tagbox' id='"+count+"Tag"+tcount+"'></div>");
    $('#'+count+'Tag' + tcount).css("opacity", "1");

    $('#'+count+'Tag' + tcount).append("<input type='image' id='"+count+"deleteButton"+tcount+"' class='deleteButton' src='./photobooth/removeTagButton.png' alt='"+getTag+"'>");
    $('#'+count+'Tag' + tcount).append("<p>"+getTag+"</p>");

    var deleted = document.getElementById(''+count+'deleteButton' + tcount);
    deleted.onclick = (function() {
      var tnum = tcount;
      var num = count;
      console.log("dbutton:"+filename+", "+num+", "+tnum);
      return function() {
                        deleteTag(filename, num, tnum);
                        }
    })();
    //var image = document.getElementById('theImage' + tcount);
    //if reaches 10 tags, add button disapper
    if($('#tagblockout'+count).children().length === 10){
      $('#addButton'+count).css('display','none');
    }
    tcount++;
}

function sendTag(filename, count) {
    // where we find the label
    var imgName = filename;
    //var imgName = document.getElementById('theImage'+num).alt;
    //var label = document.getElementById('tagSelector').value;
    var label = document.getElementById('tagSelector'+count).value;

    var url = "http://138.68.25.50:6521/query?op=add&img="+imgName+"&label="+label;

    //var formData = new FormData();
    // stick the file into the form
    //formData.append("labels", getTag);

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
function autoreadTag(filename, count,tagName) {
    console.log("read:"+filename+","+count);
    var getTag = tagName;
    console.log(getTag);
    //var getTag = $(this).parent().find('input').value;
    //var tagContainer = $(this).parent();

    //create a new img tag in html
    $('#tagblockout'+count).append("<div class='tagbox' id='"+count+"Tag"+tcount+"'></div>");
    $('#'+count+'Tag' + tcount).css("opacity", "1");

    $('#'+count+'Tag' + tcount).append("<input type='image' id='"+count+"deleteButton"+tcount+"' src='./photobooth/removeTagButton.png' class='deleteButton' alt='"+getTag+"'>");
    $('#'+count+'Tag' + tcount).append("<p>"+getTag+"</p>");
    var deleted = document.getElementById(''+count+'deleteButton' + tcount);
 //   console.log(deleted);
    deleted.onclick = (function() {
      var tnum = tcount;
      var num = count;
      console.log("dbutton:"+filename+", "+num+", "+tnum);
      return function() {
                        deleteTag(filename, num, tnum);
                        }
    })();
    //var image = document.getElementById('theImage' + tcount);

    tcount++;
}

function autosendTag(filename, count,tagName) {
    // where we find the label
    var imgName = filename;
    //var imgName = document.getElementById('theImage'+num).alt;
    //var label = document.getElementById('tagSelector').value;
    var label = tagName;

    var url = "http://138.68.25.50:6521/query?op=add&img="+imgName+"&label="+label;

    //var formData = new FormData();
    // stick the file into the form
    //formData.append("labels", getTag);

    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so
    // it is often omitted; it means do the upload
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed.
    oReq.open("GET", url, false);
    oReq.onload = function() {
    // the response, in case we want to look at it
    console.log(oReq.responseText);
  //image.style.opacity = 1.0;
    }
    oReq.send();
}

function deleteTag(dfilename, count, tagcount) {
    // where we find the label
    var imgName = dfilename;
    //var label = document.getElementById('tagSelector').value;
    var label = $('#'+count+'deleteButton' + tagcount).attr("alt");
    //var label = tagName;
    console.log("removetag"+tagcount);
    $('#'+count+'Tag'+tagcount).remove();
    //if less than 10 tags, add button appear
    if($('#tagblockout'+count).children().length < 10){
      $('#addButton'+count).css('display','block');
    }


    var url = "http://138.68.25.50:6521/query?op=delete&img="+imgName+"&label="+label;

    //var formData = new FormData();
    // stick the file into the form
    //formData.append("labels", getTag);

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


function display_tag()
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
            addTagsToDOM(dataArray);
        }
    };
    oReq.send();


}
function addTagsToDOM(dataArray)
{
    alert("try to add photo");
    //   console.log(dataArray[0].fileName);
    var mylength = (dataArray.length);
    console.log(mylength);

    //create a new img tag in html
    for (var count=0;count<mylength;count++)
    {
        var source = dataArray[count].fileName;
        console.log("file:"+dataArray[count].labels);
        var getTag = dataArray[count].labels.split(", ").filter(n => n);
        //getTag = getTag.filter(function(n){ return n != undefined });
        console.log("file:"+getTag);
        var taglength = getTag.length;
        console.log("file:"+taglength);

        for (tcount=0;tcount<taglength;tcount++){
          $('#tagblockout'+count).append("<div class='tagbox' id='"+count+"Tag"+tcount+"'></div>");
          $('#'+count+'Tag' + tcount).css("opacity", "1");

          $('#'+count+'Tag' + tcount).append("<input type='image' id='"+count+"deleteButton"+tcount+"' class='deleteButton' src='./photobooth/removeTagButton.png' alt='"+getTag[tcount]+"'>");
          $('#'+count+'Tag' + tcount).append("<p>"+getTag[tcount]+"</p>");

          var deleted = document.getElementById(''+count+'deleteButton' + tcount);
          var image = document.getElementById('theImage' + count);
          deleted.onclick = (function() {
            var tnum = tcount;
            var num = count;
            var imagename = image.alt;
            console.log("dbutton:"+imagename+", "+num+", "+tnum);
            return function() {
                              console.log("dom tag delete:"+imagename+", "+num);
                              deleteTag(imagename, num, tnum);
                              }
          })();
        }

    }
    //if reaches 10 tags, add button disapper
    if($('#tagblockout'+count).children().length === 10){
      $('#addButton'+count).css('display','none');
    }
}
