const fs = require('fs');
const path = require('path');

const App = require('@core/app');

class Server extends App {
    constructor(opt) {
        super();
        this.opt = opt || this.config;
    }

    moduleLoad(moduleName) {
        this.app.set('views', path.join(__dirname, moduleName));

        fs.readdirSync(path.join(__dirname, moduleName)).forEach(_module => {
            _module.length ? require(path.join(__dirname, moduleName, _module)) : false;
        });
        this.logger.log("Modules loaded successfully");
    }

    setup() {
        this.moduleLoad('modules');
        this.middlewareSetup();
        this.routerSetup();
    }

    middlewareSetup() {
        this.middleware.external(this.app, this.config);
        this.middleware.custom(this.app, this.config);
        this.logger.log("External middleware setup done");
    }

    routerSetup() {
        const routes = require('./routes');
        routes.init(this.app);
    }

    listen(cb) {
        this.setup();
        return this.app.listen(this.config.port, this.config.host, cb({ port: this.config.port, host: this.config.host }));
    }
}

module.exports = Server;