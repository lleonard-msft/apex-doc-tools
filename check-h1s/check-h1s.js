// check-h1s.js
// v0.0.0 - 11 October 2017 (Version history follows program code)
//
// A node.js program to detect and remove lines from content; in this
// iteration, we remove content that begin and end with two french 
// braces ( {{ .. }} ) in a set of Markdown files.
// lance Leonard (alleonar), 7 July 2017
//
// Use: node check-h1s <filename>
//
// where <filename> is one of the following:
// - an individual Markdown file in a form suitable for publication to 
//      docs.microsoft.com.
// - a text file containing a line-separated list of Markdown files to 
//      be processed.
//
// Purpose: To detect (and fix) a specific error in generated content.
//
// To Do:
// 
// 1.  Review for clean-up and publish-ability.
//
// 2.  Re-do status reporting so that it can be logged 

/**
 * Simple function to determine whether a value specifies an actual
 * (non-null) value. 
 **/
function isBlank( inputValue ) {

   var blnResult = ( ( inputValue == undefined ) ||
                     ( inputValue == null ) || 
                     ( inputValue == "" ) );
   return blnResult;

}

/**
 * Shortcut function for writing to the console.
 **/
function clog( oOutput ) {
   console.log( jStr( oOutput ) );
}

/**
 * Shortcut function that prettifies JSON output.
 **/
function jStr( oInput ) {
   return JSON.stringify( oInput, undefined, 3 )
}

/**
 * Attempts to normalize directory slashes across OSs.
 * (Currently incomplete?)
 **/
function normalizeSlashes( sInput ) {
   var aPieces = sInput.split( '/' );
   return( aPieces.join( '\\' ) );
}

/**
 * Searches an individual file for a given problem and attempts 
 * to repair it.
 **/
function processMarkdownFile( strFilename ) {

   // Load file into an array with each source line as a unique element.
   var strInFile = fs.readFileSync( strFilename, 'utf-8' );
   var aryLines = strInFile.split( /[\r\n]+/ );

   // Note that we use indexOf rather than string comparison due to 
   // character differences found in the files.  (Need to investigate
   // more deeply).

   if ( aryLines[0].indexOf( k_bad_h1 ) == -1 ) {
    console.log( strFilename + " looks OK; verify by hand.\n" );
   } else  { //try to fix it up. 
      var aResults = [];
      var sResType = "<oops>";

      // First, find the line that describes the GET endpoint
      var iGetLine = -1;  // error condition
      for ( var x = 0; x < aryLines.length; x++ ) {
      
         var re = /^\|\[Get (.*?)\]/;
         aResults = aryLines[ x ].match( re );
         if ( aResults ) {
            iGetLine = x;
            sResType = aResults[1];
         } 

         if ( iGetLine != -1 ) {
          break;
         }
      }

      if ( iGetLine == -1 ) {
        console.log( strFilename + ": Error GET not found.\n")
      } else {
        aryLines[0] = "# " + sResType + " resource type"; 
        var sOutFile = aryLines.join( os.EOL );
        fs.writeFileSync( strFilename, sOutFile );
        console.log( strFilename + ": updated (" + sResType + ")\n")
      }
    }
}

/**
 * Manages the file file specified as the input parameter.  Eventually,
 * this will determine if the input file is a single markdown file or 
 * a file of filenames.  If the latter, each filename is added to an 
 * array and then the array is processed.
 **/
function processInputFile( strInputFile )
{
   // Currently, assume the file specifies a set of files
   // (We'll support the individual file case later.)
   var strInFile = fs.readFileSync( strFilename, 'utf-8' );
   var aryFiles = strInFile.split( /[\r\n]+/ );

   clog( aryFiles.length + " file(s) found.  Starting to process..." );

   for ( var x = 0; x < aryFiles.length; x++ ) {
      clog( "Processing " + aryFiles[ x ] + "..." );
      processMarkdownFile( aryFiles[ x ] );
   }
   clog( "Files processed.  Done!" );
}

// void main() - program begins here

var fs = require( "fs" ),
    os = require( "os");
var strErrorMsg = "";  // assume everything's fine.
var k_bad_h1 = "#  resource type";


var strFilename = process.argv[ 2 ];
if ( isBlank( strFilename ) ) {
   console.log( "Declaration error: Source file not specified." );
   return
} else {
   processInputFile( strFilename );
}


return
/*

Version history:

11 Oct 2017 - v0.0.0 - Started, using h1check, v0.9.4 as a baseline

*/