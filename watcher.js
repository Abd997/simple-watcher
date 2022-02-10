var glob = require('glob');  

var process = require('process');
var cp = require('child_process');
var fs = require('fs');

const server_path = './src/server.js';
let server = cp.fork(server_path);
console.log('Server started');

const watchFile = file => { 
    fs.watchFile(file, function (event, filename) {
    server.kill();
    console.log('Server stopped');
    server = cp.fork(server_path);
    console.log('Server started');
})};

glob('src/**/*.js', function( err, files ) {
    files.map((file) => watchFile(file));
});

process.on('SIGINT', function () {
    server.kill();
    glob('src/**/*.js', function( err, files ) {
        files.map((file) => fs.unWatchFile(file));
    });
    process.exit();
});
