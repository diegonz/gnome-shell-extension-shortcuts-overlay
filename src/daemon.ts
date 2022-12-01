const Me = imports.misc.extensionUtils.getCurrentExtension();
const Shell = imports.gi.Shell;
const Main = imports.ui.main;

import {AbstractExtension} from './abstractExtension';
import {Overlay} from './overlay';

export class Daemon extends AbstractExtension {
    private _overlay: Overlay;
    private _customFileChangeHandlerId: number;

    constructor() {
        super();

        this._overlay = new Overlay();

        this._customFileChangeHandlerId = this._settings.connect('changed::use-custom-file', () => {
            if (!this._settings.get_boolean('use-custom-file'))
                this._settings.set_string('shortcuts-file', Me.dir.get_child('shortcuts.json').get_path());
        });

        const shellActionMode = Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW;
        Main.overview._specialToggle = () => this._overlay.toggleOverlay();
        Main.wm.setCustomKeybindingHandler('toggle-overview', shellActionMode, () => this._overlay.toggleOverlay());
    }

    /**
     * Clean up stuff which is not cleaned up automatically.
     *
     * @function
     * @public
     */
    destroy() {
        this._settings.disconnect(this._customFileChangeHandlerId);
        this._customFileChangeHandlerId = 0;

        Main.wm.setCustomKeybindingHandler('toggle-overview', Shell.ActionMode.NORMAL, Main.overview.toggle.bind(this, Main.overview));
        delete Main.overview._specialToggle;

        this._overlay.destroy();

        super.destroy();
    }
}
