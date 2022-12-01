const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

import * as Gio from 'gnome-typescript-types/gio';

export abstract class AbstractExtension {
    protected _settings: Gio.Settings;

    constructor() {
        if (this.constructor === AbstractExtension)
            throw new Error("Abstract classes can't be instantiated.");

        this._settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);
    }

    /**
     * Call it (<b><i>super.destroy()</i></b>) at the end of the child class destructor
     * Clean up stuff which is not cleaned up automatically.
     *
     * @function
     * @protected
     */
    destroy() {
        if (this._settings) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete this._settings;
        }
    }
}
