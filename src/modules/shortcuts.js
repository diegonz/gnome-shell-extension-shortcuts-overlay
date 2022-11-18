'use strict';

const {Gio, GLib} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.metadata["gettext-domain"]).gettext;
const Main = imports.ui.main;

const Extension = Me.imports.modules.extension.Extension;

// noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
var Shortcuts = class Shortcuts extends Extension { // NOSONAR

    constructor() {
        super();
    }

    /**
     * Reads the shortcuts from a file specified in the settings.
     * If it is not there defaults to the shortcuts file provided by the extension.
     *
     * @return {ShortcutGroup[]|*[]}
     * @public
     */
    getShortcutGroups() {
        const shortcutsFile = this._settings.get_boolean("use-custom-file")
            ? this._settings.get_string("shortcuts-file")
            : Me.dir.get_child("shortcuts.json").get_path();

        if (!GLib.file_test(shortcutsFile, GLib.FileTest.EXISTS)) {
            Main.notifyError(_("Shortcuts file not found: '%s'").format(shortcutsFile));
            return [];
        }

        const file = Gio.file_new_for_path(shortcutsFile);
        const [resultOk, contents] = file.load_contents(null);

        if (!resultOk) {
            Main.notifyError(_("Unable to read file: '%s'").format(shortcutsFile));
            return [];
        }

        return JSON.parse(imports.byteArray.toString(contents));
    }

    destroy() {
        super.destroy();
    }
}
