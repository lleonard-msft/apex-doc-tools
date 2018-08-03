# APEX documentation tools

This project collects a variety of Node.js tools, utilities, scripts, and one-shots I've written to support documentation projects for Microsoft's Azure Platform Experiences team.  

It's a bit of a grab bag, honestly.  But, I wanted to share them in case anyone else is trying to solve similar problems.  (I also wanted to have a backup in case anything happens to my machine.)

Each directory provides a separate tool, though some tools are designed to run in conjunction with others.

Here's what I've got so far:

_Active projects:_

- [api2pages](./apipages/) supports Moxygen, a utility that converts Doxygen XML output data to a single Markdown file.  My utility parses that output file to separate pages suitable for including in a Microsoft docs project.

- _build-graph-toc_ (pending) supports the Microsoft Graph API for Intune project; it scans a folder of resource object reference pages and creates an table of contents snippet.

- [find-dupes](./find-dupes) scans a folder of reference pages, looking for duplicate endpoints.  It identifies the duplicates so they can be consolidated separately.  (A companion clean-up script is planned, but not yet built.)

- [nbxutils](./nbxutils/) is a Node.js module (WIP) that collects routines common to my scripts.  

_Inactive projects:_

- [check-h1s](./check-h1s/) scans a folder of Markdown files for H1s that do not include the object type.  When found, it repairs the error, using data taken from the methods table.

- _hide-todos_ (pending) scans a folder of Markdown files (and any child folders) for "//TODO" sequences; it replaces these with a less cryptic phrase that's more accessible to non-developers. 

- [toc-gather](/.toc-gather) searches a YAML-based TOC file and collects information used to validate the SEO elements in the associated article, including filename, title, H1.  It generates a data file designed to be imported into other tools.

There may be interesting bits of code, but most of it is designed to be utilitarian.  These are generally written under deadline pressure and are maintained as needed.  

_Experiments and prototypes:_

- _camel2sentence_ (pending) takes a resource name written in camel case (ex: "camelCase" ) and inverts the capitals so the result is a traditional sentence style (ex: "Camel case").  (This was later incorporated into _build-graph-toc_.)

- _checkStyle_ (pending) searches a series of strings for patterns corresponding to editorial style guidelines; matches are then converted to reflect those guidelines.  (This was also incorporated into _build-graph-toc_.)

Consider everything a work-in-progress.

If you have feedback, please file issues or PRs accordingly.