// nbxUtils.js
// A node.js module collecting build utility functions.
// lance Leonard (alleonar), 27 April 2017
// Derived from http://lanceleonard.com/post/2017/02/12/creating-node-modules.html

/**
 * Is the input value blank?
 **/ 
module.exports.isBlank = function( inputValue ) {

   var blnResult = ( ( inputValue == undefined ) ||
                     ( inputValue == null ) || 
                     ( inputValue == "" ) );
   return blnResult;

}

/**
 * Returns an array of filenames for a given folder and 
 * its children.
 **/ 
module.exports.collectFilenames = function( strTargetPath ) {

   var oResults = new Object;
   oResults.paths = [];
   oResults.paths.push( strTargetPath );
   oResults.files = [];

   var fs = require( 'fs' );

   for ( var xDir = 0; xDir < ( oResults.paths.length ); xDir++ ) {
      var sCurrDir = oResults.paths[ xDir ];
      var aThisDir = fs.readdirSync( sCurrDir );

      for ( var xThisFile = 0; xThisFile < ( aThisDir.length ); xThisFile++ ) {

         var strFullFilename = sCurrDir + "/" + aThisDir[ xThisFile ];
         var xTFStat = fs.statSync( strFullFilename );

         if ( xTFStat.isFile() ) {
            oResults.files.push( strFullFilename );
         } else { if ( xTFStat.isDirectory() ) {
            oResults.paths.push( strFullFilename );
         } else {
            console.log( "Skipping ", strFullFilename, 
                         "; not a file or directory." );
         } }
      } 
   }
   return oResults.files;
}