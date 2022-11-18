'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
var Extension = // NOSONAR

    /**
     * @abstract
     */
    class Extension {

    constructor() {
        if (this.constructor === Extension) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        /**
         * The extension settings
         * @type {ExtensionSettings}
         * @protected
         */
        this._settings = ExtensionUtils.getSettings(Me.metadata["settings-schema"]);
    }

    /**
     * Call it (<b><i>super.destroy()</i></b>) at the end of the child class destructor
     * Clean up stuff which is not cleaned up automatically.
     * @function
     * @protected
     */
    destroy() {
        if (this._settings) {
            delete this._settings;
        }
    }
}
