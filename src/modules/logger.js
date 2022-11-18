'use strict';

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Extension = Me.imports.modules.extension.Extension;

// noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
var Logger = class Logger extends Extension { // NOSONAR
    constructor() {
        super();
    }

    /**
     * Logs a message to the journal
     *
     * @param message
     */
    log(message) {
        // const timestamp = new Date().toISOString();
        // noinspection JSUnresolvedFunction
        log(`[${new Date().toLocaleString()}] [${Me.metadata.uuid}] ${message}`);
    }
};
