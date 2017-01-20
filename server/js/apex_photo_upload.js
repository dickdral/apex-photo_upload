// APEX Resize and Upload Photo
// Author: Dick Dral
// Date: 20-01-2017
// Version: 1.0

// global namespace
var apex_photo_upload = {

/************************************************************
 * clob2Array: builds a js array from long string
 * Parameters: clob               clob to be chunked
 *             size               max size of chunks
 */
clob2Array: function (clob, size) {
  var array = [];
  loopCount = Math.floor(clob.length / size) + 1;
  for (var i = 0; i < loopCount; i++) {
    array.push(clob.slice(size * i, size * (i + 1)));
  }
  return array;
},
/************************************************************
 * resize: performs resizing and rotating of image
 * Parameters: dataURL            image
 *             maxSize            size of bouding box
 *             callback           function to be performed after action
 */
resize :function(dataURL, maxSize, callback) 
{
	var image = new Image();
    var rotation = 0;
	image.onload = function (imageEvent) 
        {
			// create canvas
			var canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');

            // get orientation right
            EXIF.getData(image,function() 
            {
                var orientation = EXIF.getTag(this,"Orientation");
                switch(orientation){
                    case 8: rotation = 180;          break;
                    case 3: rotation = -90;          break;
                    case 6: rotation =  90;          break;
                    }
            });

            // determine new dimensions
			var width  = image.width;
			var height = image.height;
            if (width > height) 
            {
			    if (width > maxSize) 
                {
					height *= maxSize / width;
					width = maxSize;
				}
			} else 
            {
				if (height > maxSize) 
                {
					width *= maxSize / height;
					height = maxSize;
				}
			}

            if ( rotation == 0 )
            { 
                canvas.width  = width;
				canvas.height = height;
                ctx.drawImage(image, 0, 0, width, height);
            } else
            {
                canvas.width  = height;
				canvas.height = width;
                ctx = canvas.getContext('2d');

                // translate to center-canvas 
                // the origin [0,0] is now center-canvas
                ctx.translate(canvas.width / 2, canvas.height / 2);

                // roate the canvas by +90% (==Math.PI/2)
                ctx.rotate(Math.PI / 2);

                // draw the image
                // parameters 2-5 indicate cropping of image => whole image
                // parameters 6-9 indicate location and size of image on canvas
                // since images draw from top-left offset the draw by 1/2 width & height
                ctx.drawImage(image, 0, 0 , image.width, image.height, -width / 2, -height / 2, width, height);

                // un-rotate the canvas by -90% (== -Math.PI/2)
                ctx.rotate(-Math.PI / 2);
            }

    		callback(canvas.toDataURL('image/jpeg', 0.8));
         	// output(canvas, outputType, callback);
		}
		image.src = dataURL;

},

 
/************************************************************
 * sendFileToServer: send file to server in array of chunks
 * Parameters: fileName           filename on the server
 *             base64             file content in base64
 */ 
sendFileToServer : function(fileName, base64) {

  var f01Array    = clob2Array(base64, 30000, f01Array);
  var cot_id      = apex.item('P640_IME_COT_ID').getValue();
  var text        = apex.item('P640_IME_DESCRIPTION').getValue();
  var orientation = apex.item('P640_IME_ORIENTATION').getValue();

  server.plugin
      ( pApexAjaxIdentifier,
        {
          x01: 'image/jpeg',
          x02: orientation,
          f01: f01Array
        } ,
        { success: 
             function (pData) 
             {
                if (data.result == 'success') 
                { if ( vIssueSubmit == 'Y' ) { apex.submit(); } 
                } else {
                 alert('Oops! Something went terribly wrong. Please try again or contact your application administrator.');
                }
             }
        }
      );   
},

/************************************************************
 * resize and upload file
 * Parameters: fileName           name of the file on the server
 *             maxBoxWidth        max size of resized image
 */
uploadFile: function (fileInputItem,fileName,maxBoxWidth) {
    var file = fileInputItem.files[0];
    var reader = new FileReader();
	
    reader.onload = function (readerEvent) 
    {
		resize(readerEvent.target.result
              , maxBoxWidth
              , function (resizedFile) 
                {
                    sendFileToServer(fileName, resizedFile.slice('data:image/jpeg;base64,'.length))
                });
	}
	reader.readAsDataURL(file);
},

    // function that gets called from plugin
    doIt: function() {
        // plugin attributes
        var daThis = this;
        var vElementsArray  = daThis.affectedElements;
        var vFileInputItem       = $(vElementsArray[0]).attr('id');
        var vResolution     = daThis.action.attribute01;
        var vCollectionName = daThis.action.attribute02;
        var vWritingMode    = daThis.action.attribute03;
        var vDirectory      = daThis.action.attribute04;
        var vFileNameItem   = daThis.action.attribute05;
        var vIssueSubmit    = daThis.action.attribute06;

        // Logging
        var vLogging = true;
        if (vLogging) {
            console.log('showTooltip: affectedElement:', vFileInputItem);
            console.log('showTooltip: Attribute Resolution:', vResolution);
            console.log('showTooltip: Attribute CollectionName:', vCollectionName);
            console.log('showTooltip: Attribute WritingMode:', vWritingMode);
            console.log('showTooltip: Attribute Directory:', vDirectory);
            console.log('showTooltip: Attribute FileNameItem:', vFileNameItem);
            console.log('showTooltip: Attribute IssueSubmit:', vIssueSubmit);
        }
        apex_photo_upload.uploadFile(vFileInputItem,vNumcols,vDirection);
    }

};
 
