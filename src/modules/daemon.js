'use strict';

const Shell = imports.gi.Shell;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;

const Extension = Me.imports.modules.extension.Extension;
const Overlay = Me.imports.modules.overlay.Overlay;

// noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
var Daemon = class Daemon extends Extension { // NOSONAR

    constructor() {
        super();

        /**
         * The overlay object
         * @type {Overlay}
         * @private
         */
        this._overlay = new Overlay();

        /**
         * The signal handler ID for custom file changes
         * @type {number}
         * @private
         */
        this._customFileHandler = this._settings.connect("changed::use-custom-file", () => {
            if (!this._settings.get_boolean("use-custom-file")) {
                this._settings.set_string("shortcuts-file", Me.dir.get_child("shortcuts.json").get_path());
            }
        });

        const shellActionMode = Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW;
        Main.overview._specialToggle = () => this._overlay.toggleOverlay();
        Main.wm.setCustomKeybindingHandler("toggle-overview", shellActionMode, () => this._overlay.toggleOverlay());

        // TODO: Main.wm.addKeybinding('cycle-screenshot-sizes', ExtensionUtils.getSettings(), Meta.KeyBindingFlags.PER_WINDOW, Shell.ActionMode.NORMAL, cycleScreenshotSizes);
    }

    /**
     * Clean up stuff which is not cleaned up automatically.
     * @function
     * @public
     */
    destroy() {
        this._settings.disconnect(this._customFileHandler);
        Main.wm.setCustomKeybindingHandler("toggle-overview", Shell.ActionMode.NORMAL, Main.overview.toggle.bind(this, Main.overview));
        delete Main.overview._specialToggle;
        this._overlay.destroy();

        super.destroy();
    }
}
