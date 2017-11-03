module.exports = (request, response, next) => {
    var start = +new Date();

    var stream = process.stdout;
    var url = request.url;
    var method = request.method;

    response.on('finish', () => {
        var duration = +new Date() - start;
        var message = method + ' to ' + url + '\ntook ' + duration + ' ms \n';
        stream.write(message);

    });
    next();
}
