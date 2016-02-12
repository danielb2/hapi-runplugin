#!/usr/bin/env node
'use strict';

// Load modules

const Bossy = require('bossy');
const Glue = require('glue');
const Path = require('path');
const Purdy = require('purdy');

// Declare internals

const internals = {
    showRequests: process.env.SHOW_REQUEST ? true : false,
    definition: {
        h: {
            alias: 'help',
            description: 'Show help',
            type: 'boolean'
        },
        s: {
            alias: 'show',
            description: 'Shows requests',
            type: 'boolean',
            default: false
        },
        p: {
            alias: 'path',
            description: 'Path to plugin, or installed plugin-name',
            type: 'string'
        },
        P: {
            alias: 'port',
            description: 'Port to run on',
            type: 'number',
            default: 3000
        },
        l: {
            alias: 'labels',
            description: 'Connection labels in case plugin uses specific connection',
            type: 'string'
        }
    }
};

internals.purdyRequests = function (server) {

    server.on('request-internal', (request, event, tags) => {


        if (!tags.response) {
            return;
        }

        const reqToRender = {
            time: new Date(),
            requestId: request.id,
            headers: request.headers,
            method: request.method,
            path: request.path,
            query: request.query,
            payload: request.payload,
            tags: tags ? Object.keys(tags) : ''
        };

        console.log('------ REQUEST RECEIVED -------');
        Purdy(reqToRender);
        console.log('-------------------------------');
    });
};


const initalizeBossy = function () {

    const args = Bossy.parse(internals.definition);

    if (args instanceof Error) {
        console.error(args.message);
        process.exit(1);
    }

    if (args.h) {
        console.log(Bossy.usage(internals.definition, 'node start.js'));
        process.exit(0);
    }

    return args;
};


const main = function () {

    const boss = initalizeBossy();

    const connection = {
        port: boss.port
    };

    if (boss.labels) {

        connection.labels = boss.labels.split(',');
    }

    let pluginPath = process.cwd();

    if (boss.path) {

        if (boss.path[0] === '/' || !boss.path.match('/')) {
            pluginPath = boss.path;
        }
        else {
            pluginPath = Path.join(process.cwd(), boss.path);
        }

        Purdy(boss.path);
    }


    internals.manifest = {
        connections: [connection],
        registrations: [{
            plugin: 'blipp'
        }, {
            plugin: pluginPath
        }]
    };

    Glue.compose(internals.manifest, { relativeTo: Path.join(__dirname, '/lib') }, (err, server) => {

        if (err) {
            Purdy(err);
            process.exit(1);
        }
        else {
            server.start((err) => {

                if (err) {
                    Purdy(err);
                    process.exit(1);
                }

                if (internals.showRequests || boss.show) {
                    internals.purdyRequests(server);
                }
            });
        }
    });
};


main();
