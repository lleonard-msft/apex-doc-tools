# Check H1s

This was a one-shot used to detect and repair H1s in generated content files.

It supported the Microsoft Graph API for Intune content, which is generated using internal tools.

This arose to respond to a bug in those tools, which led to H1s that did not include the resource type in the H1.  To illustrate, we'd get 

In order to ship the content, we used grep to identify the affected files, piped those results to a text file, and then fed a cleaned-up version of that to this utility.

This tool pulled the resource type from the link to the GET method and used that value to update the H1.

When the bug was fixed, this tool was no longer needed; it is currently considered inactive.
 
Updated: 30 May 2018
