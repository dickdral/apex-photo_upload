# Oracle APEX Dynamic Action Plugin -  Photo Upload
Oracle Apex plugin for resizing and uploading photo's from a smartphone. The photo's can optionally be stored on the server file system.

The resolution of the image can be specified. 
The file is resized and then uploaded. The resulting file is put into an Apex Collection. 
If indicated the file is written to the an Oracle directory. The directory and filename are stored in the Collection. 

## Change history
- V1.1 CSS file added

## Requirements
The plugin can be used with Apex 5.0 and Apex 5.1 in applications using Universal Theme.

## Install
- Import plugin file "dynamic_action_plugin_nl_detora_apex_photo_upload.sql" from source directory into your application
- Add an After Change Dynamic Action for the File Item to be used
- In the True Action refer to the Photo Upload [Plug-In] and adjust the Settings if desired

## Plugin Settings
The plugin settings are customizable and you can change:
- **Resolution** - The width (portrait) or height (landscape) in pixels of the image
- **Collection Name**- The name of the Apex collection to be used
- **Writing mode**- Whether the collection should be newly inserted or appended
- **Directory** - The Oracle directory where the images should be written
- **Item for filename** - Apex Item containing a file name to be used for the file
- **Issue Submit** - Whether a submit should be issued after the upload

## Demo Application
http://www.speech2form.com/ords/f?p=OPFG:PHOTO_UPLOAD

## Preview
![](https://github.com/dickdral/apex-report2columns/blob/master/photo_upload_example.png?raw=true)
---
