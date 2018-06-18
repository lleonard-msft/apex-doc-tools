// nbxUtils.js
// A node.js module collecting build utility functions.
// lance Leonard (alleonar), 27 April 2017
// Derived from http://lanceleonard.com/post/2017/02/12/creating-node-modules.html


// Configuration
const kPathSeparator  = "/";

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
 *
 * @param {string} Target path - Target directory to be scanned.
 * @param {boolean} Recurse - flag - through child directories (default: true) 
 **/ 
module.exports.collectFilenames = function( strTargetPath, blnRecurse ) {

   // For compatibility with earlier tools, blnRecurse defaults to true.
   var blnSearchRecursively = ( blnRecurse === false ) ? false : true;
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
         } else 
           { if ( ( blnSearchRecursively ) && ( xTFStat.isDirectory() ) ) {
               oResults.paths.push( strFullFilename );
             } else {
               console.log( "Skipping ", strFullFilename, "..." );
             }
           }
      } 
   }
   return oResults.files;
}

/**
 * Given a URL, this returns the path without the filename.  (See also: reduceFilename)
 * @param {string} full filename - The fully qualified filename to parse
 * @param {boolean} include trailing - (Optional) Include trailing separator (default: true)
 * @returns {string} the file path portion of the full filename, if any.
 */
module.exports.extractFilePath = function( sFullFilename, bIncludeTrailing ) {

   var sTrailingSep = ( bIncludeTrailing == true) ? kPathSeparator : "";
   var sResult = "";
   if ( sFullFilename != "" ) {
      var aTokens = sFullFilename.split( kPathSeparator );
      if ( aTokens.length > 0 ) {
         aTokens.pop();
         sResult = aTokens.join( kPathSeparator ) + kPathSeparator;
    }
   }
   return sResult;
}


/**
 * Returns the filename associated with a fully qualified filename.  
 * @param {string} full filename - The filename to process
 * @returns {string} the filename portion of the full filename.
 * @see {@link extractFilePath}
 */
module.exports.reduceFilename = function( sFullFilename ) {

   var sResult = "";
   if ( sFullFilename != "" ) {
      var aTokens = sFullFilename.split( kPathSeparator );
      if ( aTokens.length > 0 ) {
         sResult = aTokens[ aTokens.length - 1 ];
    }
   }
   return sResult;
}