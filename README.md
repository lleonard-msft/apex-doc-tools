# APEX documentation tools

This project collects a variety of Node.js tools, utilities, scripts, and one-shots I've written to support documentation projects for Microsoft's Azure Platform Experiences team.  

It's a bit of a grab bag, honestly.  But, I wanted to share them in case anyone else is trying to solve similar problems.  (I also wanted to have a backup in case anything happens to my machine.)

Each directory provides a separate tool, though some tools are designed to run in conjunction with others.

Here's what I've got so far:

_Active projects:_

- [api2pages](./apipages/) supports Moxygen, a utility that converts Doxygen XML output data to a single MArkdown file.  My utility parses that output file to separate pages suitable for including in a Microsoft docs project.

- [find-dupes](./find-dupes) scans a folder of reference pages, looking for duplicate endpoints.  It documents the duplicates so they can be consolidated separately.

- [nbxutils](./nbxutils/) is a Node.js module that collects routines common to my scripts.  

_Inactive projects:_

- [check-h1s](./check-h1s/) scans a folder of Markdown files for H1s that do not include the object type.  When found, it repairs the error, using data taken from the methods table.

-[toc-gather](/.toc-gather) searches a YAML-based TOC file and collects information used to validate the SEO elements in the associated article, including filename, title, H1.  It generates a data file that is imported into other tools.

There may be interesting bits of code, but most of it is designed to be utilitarian.  These are generally written under deadline pressure and are maintained as needed.  

Consider them works-in-progress.

If you have feedback, please file issues or PRs accordingly.