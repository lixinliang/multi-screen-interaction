'use strict';

let http = require('http');
let io = require('socket.io');
let colors = require('colors');
let uuid = require('node-uuid');

let server = http.createServer();
let controller = io(server);

/**
 * Define in ../webpack/webpack.node.js
 * @type {Number} port
 */
let port = parseInt(process.argv[process.argv.length-1]);

if (!port) {
    console.log('Socket Server: Socket server requires a current port!\n'.red);
    process.exit(1);
}

let storage = {};

/**
 * Create an unique uid
 * @type {Number} uid
 */
let getUid = () => {
    let uid = uuid.v4();
    return storage[uid] ? getUid() : uid;
};

/**
 * Socket
 * @param  {Socket} socket
 */
controller.on('connection', ( socket ) => {

    console.log('Socket Server: Someone is connected!\n'.green);

    /**
     * Create a relationship and become the host, then register the given events
     * @param  {Array} events
     * @param  {Function} callback
     * @return {Number} uid
     */
    socket.on('create', ( events, callback ) => {

        let uid = getUid();
        console.log(`Socket Server: Create a host, uid >> ${ uid }\n`.green);

        let host = socket;
        let client = [];
        let relationship = {
            join ( socket ) {
                let index = client.length;
                client.push(socket);
                listen(socket);
                return index;
            },
            remove ( index ) {
                let socket = client[index];
                socket.client.destroy();
                client[index] = null;
            },
        };
        storage[uid] = relationship;
        socket.on('disconnect', () => {
            console.log(`Socket Server: Host is disconnected\n`.green);
            storage[uid] = null;
            client.concat(host).forEach(( socket ) => {
                if (socket) {
                    socket.client.destroy();
                }
            });
        });
        let listen = ( target ) => {
            events.forEach(( name ) => {
                target.on(name, function () {
                    console.log(`Socket Server: Receive an action, event >> ${ name }, uid >> ${ uid }, timestamp >> ${ +new Date }\n`.green);
                    let args = [name].concat([].slice.call(arguments));
                    client.concat(host).forEach(( socket ) => {
                        if (socket) {
                            socket.emit.apply(socket, args);
                        }
                    });
                });
            });
        };
        listen(socket);
        callback(uid);
    });

    /**
     * Search the host by uid, and join as its client
     * @param  {Number} uid
     * @param  {Function} callback
     */
    socket.on('join', ( uid, callback ) => {
        let relationship = storage[uid];
        if (relationship) {
            let index = relationship.join(socket);
            socket.on('disconnect', () => {
                console.log(`Socket Server: Someone is disconnected\n`.green);
                relationship.remove(index);
                socket.client.destroy();
            });
            console.log(`Socket Server: Create a client, uid >> ${ uid }\n`.green);
            callback();
        } else {
            let err = true;
            callback(err);
            socket.on('disconnect', () => {
                socket.client.destroy();
            });
        }
    });
});

server.listen(port);

console.log('Socket Server: Server run successfully!\n'.green);
