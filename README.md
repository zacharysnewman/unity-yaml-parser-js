# Unity YAML Parser JS #

This project aims to provide a NodeJS API to load and dump Unity YAML 
files(configurations, prefabs, scenes, serialized data, etc) in the exact same 
format the internal Unity YAML serializer does.

Using this API you will be able to easily manipulate(as js objects) 
Unity YAML files and save them just the same, keeping the YAML structure
exactly as Unity does. This has the advantages of, first not having to
configure PyYAML beforehand to deal with Unity YAMLs, and second as the
modified file keeps the same structure and formatting that Unity does, 
when the YAML file is loaded by Unity it won't make formatting changes 
to it that will make any VCS report unexpected file changes.

## Installing ##
Via source

## A Simple Example ##
TBD
