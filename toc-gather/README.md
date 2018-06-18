# TOC Gather

This is a one-shot written to support an internal Hackathon project in April 2017.  It collected data used to evaluate and improve SEO performance of Intune documentation.  (FWIW, It's also the first tool I wrote after returning to Microsoft; I banged it out in a couple of hours.)

The Hackathon project reviewed consistency between the elements that we know contribute to SEO placement:

- The filename
- The document title 
- The introductory header (H1)
- The short title used in the TOC menu

This utility scans a TOC file (written in YAML), locates the documentation file in the corresponding repo, and pulls the desired data values.  Note that the source files are assumed to support docs.microsoft.com.  

The result is a comma-delimited data file that can be imported into Excel for additional analysis.

It's a very quick-and-dirty implementation, one tightly-coupled to my machine and the project I was working on at the time.

It's currently inactive, but remains in the collection in case a similar need arises.

Updated: 30 May 2018