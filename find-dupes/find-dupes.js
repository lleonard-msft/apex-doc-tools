
// find-dupes.js, v0.0.2 
// by lance.leonard@microsoft.com, 15 May 2018

/**
 * Describes the utility and how to call it
 **/
function _about() {

   console.log( "find-dupes finds duplicate endpoints within a list of filenames.\n\n" + 
                "Use:\n\n" + 
                "   node find-dupes <input>\n\n" + 
                "where <input> is either a text file containing filenames (one per line) or\n" + 
                "a directory to be searched for filenames (recursively).")
}

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
   return JSON.stringify( oInput, undefined, 3 );
}

/**
 * Given an array of objects and a field common to each, 
 * this returns an array sorted on the values of that field.
 *
 * There's probably a more idiomatic way to do this.
 *
 * @param aryInput The input array of objects 
 * @param strFieldName The field to sort by
 * @param strClarifier When specified, identifies a second field that ensures the 
 *    uniqueness of the sort value (the content are added to the contents of the 
 *    first field. Optional.) 
 **/
function sortObjectArray( aryInput, strFieldName, strClarifier = "" ) {

   var aryControl = [], // Original order of sort value
       arySorted = [],  // Sorted version of sort values
       aryResult = [];  // Array returned to caller

   fs.writeFileSync( './sort-input-array.txt', jStr(aryInput), 'utf-8' );
   // Populate temp arrays
   for ( var x = 0; x < aryInput.length; x++ ) {
      var o = aryInput[ x ];
      var strIndexNo = padString( x, 4 );
      // Need a unique value to avoid losing data during sort.
      var strSortValue = o[ strFieldName ];
      if ( strClarifier == "" ) {
         strSortValue += "&&" + strIndexNo; 
      } else {
         strSortValue += o[ strClarifier ];
      }

      strSortValue = strSortValue.toLowerCase();
      aryControl.push( strSortValue );
      arySorted.push( strSortValue );
   }

   // ensure use of dictionary sorting.
   arySorted.sort( function( a, b ) 
                      { return a.localeCompare(b); } );

   // The intended algorithm is to walk through the sorted
   // version of the array, find the current item in the 
   // original (control) order, and then add its data to 
   // the return array.

   for ( var x = 0; x < aryInput.length; x++ ) {
      var intOrigIndex = aryControl.indexOf( arySorted[ x ] );
      aryResult.push( aryInput[ intOrigIndex ] );
   }

   return aryResult;
}


// void main() - program begins here

var fs = require( "fs" ),
    os = require( "os"),
    nbx = require( "./nbxutils.js" )
var strErrorMsg = "";  // assume everything's fine.

var strFilename = process.argv[ 2 ];
if ( isBlank( strFilename ) ) {
   console.log( "Declaration error: Source file not specified.\n\n" );
   _about();
   return
} else {

   // If the input string is a file, open it and use it to 
   // populate the control array.  If it's a directory, 
   // collect filenames from it.

   var oFileStat = fs.statSync( strFilename );
   if ( oFileStat.isFile() ) {
      var strInFile = fs.readFileSync( strFilename, 'utf-8' );
      var aryLines = strInFile.split( /[\r\n]+/ );
      for ( var xIndex = 0; xIndex < aryLines.length; xIndex++ ) {
         if ( aryLines[ xIndex ] != "" ) {
            aryFiles.push( aryLines[ xIndex ]);
         }
      }
   } else {  // it's a directory
      aryFiles = nbx.collectFilenames( strFilename );
   }
  
   console.log( aryFiles.length + " file(s) found...");
   // For each filename listed in the data file, break it into 
   // component pieces for further analysis.
   var aryRecords = [];

   // This depends on the existing Intune reference filename 
   // conventions.  If those change, this will need to be reworked.
   for ( var xLine = 0; xLine < aryFiles.length; xLine++ ) {
   
      if ( aryFiles[ xLine ] == "" ) { continue; }
      var oRecord = new Object();
      oRecord.filename = aryFiles[ xLine ];
      var aryTokens = oRecord.filename.split( '_' );
      oRecord.service = aryTokens[ 0 ];
      oRecord.category = aryTokens[ 1 ];
      oRecord.endpoint = aryTokens[ 2 ];
      var intPeriod = oRecord.endpoint.indexOf( '.' );
      if ( intPeriod > -1  ) {
         oRecord.endpoint = oRecord.endpoint.substr( 0, intPeriod );
      }
      aryRecords.push ( oRecord );
   }

   // Next, collect the names of the endpoints and count them
   var oEndpoints = new Object();
   for ( var xRecord = 0; xRecord < aryRecords.length; xRecord++ ) {

      var strEndpoint = aryRecords[ xRecord ].endpoint;
      if ( oEndpoints.hasOwnProperty( strEndpoint ) ) {
         oEndpoints[ strEndpoint ]++;
      } else {
         oEndpoints[ strEndpoint ] = 1;
      }

   }

   // Now, evaluate the counts and gather the offending filenames
   var oDuplicates = new Object();
   var aryKeys = Object.keys( oEndpoints );
   for ( var xKey = 0; xKey < aryKeys.length; xKey++ ) {

      var strThisKey = aryKeys[ xKey ];
      if ( oEndpoints[ strThisKey ] > 1 ) {
         oDuplicates[ strThisKey ] = new Object();
         oDuplicates[ strThisKey ].dupeCount = oEndpoints[ strThisKey ];
         oDuplicates[ strThisKey ].files = [];
      }

   }

   // Finally, collect the offending filenames 
   var aryKeys = Object.keys( oDuplicates );
   aryKeys.sort( (a, b) => a.localeCompare( b ) );

   for ( var xKey = 0; xKey < aryKeys.length; xKey++ ) {

      var strThisKey = aryKeys[ xKey ];
      for ( var xFile = 0; xFile < aryRecords.length; xFile++ ) {

         if ( aryRecords[ xFile ].endpoint == strThisKey ) {
            oDuplicates[ strThisKey ].files.push( aryRecords[ xFile ].filename );
         }

         // If we've found all the files already, we don't 
         // need to finish looping through the array
         if ( oDuplicates[ strThisKey ].files.length >= 
              oDuplicates[ strThisKey ].dupeCount ) {
            break;
         }
      }
   }

   var strResultsFile = './duplicate-endpoint-files.txt';
   fs.writeFileSync( strResultsFile, jStr( oDuplicates), 'utf-8' );
   console.log( aryKeys.length + " duplicate endpoints found; details in " + strResultsFile )
    
   // debug
//   fs.writeFileSync( './filename-data.txt', jStr( aryRecords ), 'utf-8' );

}


process.exit();
/*

// TODO:
// 1.  Refactor to be more command-line friendly.
// 2.  Add additional parameters to support logging and carp levels.
// 3.  Review and refactor use of variables and variable naming.


Version history:

11 Oct 2017 - v0.0.0 - Started
28 Mar 2018 - v0.0.1 - Review and clean up for production use.
22 May 2018 - v0.0.2 - Refactored the input parameter handling so that we can pass a file or load up from a directory reference.

*/