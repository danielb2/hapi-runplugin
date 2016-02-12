# hapi-runplugin
Runs a hapi server using the plugin and uses
[blipp](https://github.com/danielb2/blipp) to output route info

Useful for easily displaying route info and for testing the plugin

## Command Line

**hapi-runplugin** supports the following command line options:
- `-P`, `--port` - port to run the server (3000)
- `-h`, `--help` - display help
- `-l`, `--labels` - additional label connections
- `-o`, `--options` - JSON file containing options to pass to plugin
- `-p`, `--path` - path to plugin or installed plugin name (CWD)
- `-s`, `--show` - shows requests to the server


### Example:

``` bash

$ npm install hapi-runplugin hapi-info -g
$ hapi-runplugin -p hapi-info
$ hapi-runplugin -p hapi-info
http://sanji.local:3000
  GET    /hapi-info

```

