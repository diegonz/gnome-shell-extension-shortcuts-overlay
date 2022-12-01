// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
import * as St from 'gnome-typescript-types/st';
import {AbstractExtension} from './abstractExtension';
import {FileReader} from './fileReader';
import {ShortcutSpec} from './index';

export class Overlay extends AbstractExtension {
    private _isVisible: boolean;
    private _containerBoxLayout: St.BoxLayout | undefined;
    private _fileReader: FileReader;

    constructor() {
        super();

        this._isVisible = false;
        this._fileReader = new FileReader();
    }

    /**
     * Shows the overlay
     *
     * @function _showOverlay
     * @private
     */
    _showOverlay() {
        if (this._isVisible)
            return;


        if (this._containerBoxLayout === undefined)
            this._containerBoxLayout = this._buildOverlayContents();

        if (this._containerBoxLayout !== undefined) {
            Main.uiGroup.add_child(this._containerBoxLayout);
            const monitor = Main.layoutManager.primaryMonitor;
            const xPosition = monitor.x + Math.floor(monitor.width / 2 - this._containerBoxLayout.width / 2);
            const yPosition = monitor.y + Math.floor(monitor.height / 2 - this._containerBoxLayout.height / 2);
            this._containerBoxLayout.set_position(xPosition, yPosition);

            this._isVisible = true;
        }
    }

    /**
     * Builds and returns the overlay contents
     *
     * @function _createOverlayContents
     * @returns {BoxLayout}
     * @private
     */
    _buildOverlayContents() {
        const containerBoxLayout = new St.BoxLayout({style_class: 'background', pack_start: false, vertical: true});
        const wrapperBoxLayout = new St.BoxLayout({style_class: 'wrapper', pack_start: false, vertical: false});
        containerBoxLayout.add_child(wrapperBoxLayout);

        for (const innerBoxLayout of this._buildInnerBoxLayouts())
            wrapperBoxLayout.add_child(innerBoxLayout);

        return containerBoxLayout;
    }

    /**
     * Hides the overlay by removing the actors
     *
     * @function _hideOverlay
     * @private
     */
    _hideOverlay() {
        if (!this._isVisible)
            return;


        Main.uiGroup.remove_child(this._containerBoxLayout);
        this._containerBoxLayout = undefined;
        this._isVisible = false;
    }

    /**
     * Builds and returns the inner box layouts for overlay
     *
     * @function _createInnerBoxLayouts
     * @returns {BoxLayout[]}
     * @private
     */
    _buildInnerBoxLayouts() {
        const innerBoxLayoutCount = this._settings.get_int('inner-boxlayout-count');
        const progressStep = 1 / innerBoxLayoutCount;
        let progress = 0.0;
        let target = 0;
        const shortcutGroups = this._fileReader.getShortcutGroups();
        const totalShortcuts = shortcutGroups.reduce((count: number, current) => count + current.shortcuts.length, 0);

        /**
         * @type {BoxLayout[]}
         */
        const innerBoxLayouts = [];

        for (let i = 0; i < innerBoxLayoutCount; i++) {
            innerBoxLayouts.push(new St.BoxLayout({
                style_class: 'inner-boxlayout',
                pack_start: false,
                vertical: true,
            }));
        }

        for (const {name, shortcuts} of shortcutGroups) {
            const currentProgressStep = progressStep * (target + 1);
            target = progress < currentProgressStep ? target : target + 1;
            progress += shortcuts.length / totalShortcuts;

            innerBoxLayouts[target].add_child(new St.Label({style_class: 'group_name', text: name}));
            for (const shortcut of shortcuts)
                innerBoxLayouts[target].add_child(this._buildShortcutBoxLayout(shortcut));
        }

        return innerBoxLayouts;
    }

    /**
     * Builds and returns a BoxLayout for a given shortcut
     *
     * @param {ShortcutSpec} shortcut The shortcut object from JSON config file
     * @returns {BoxLayout}
     * @private
     */
    _buildShortcutBoxLayout(shortcut: ShortcutSpec) {
        const shortcutBoxLayout = new St.BoxLayout({style_class: 'shortcut', pack_start: false, vertical: false});
        const keysBoxLayout = new St.BoxLayout({style_class: 'keys-boxlayout', pack_start: false, vertical: false});

        for (const [groupsIndex, keysGroup] of shortcut.keys.entries()) {
            for (const [index, key] of keysGroup.entries()) {
                keysBoxLayout.add_child(new St.Label({style_class: 'kbd', text: key}));
                if (index < keysGroup.length - 1)
                    keysBoxLayout.add_child(new St.Label({style_class: 'plus', text: '+'}));
            }
            if (groupsIndex < shortcut.keys.length - 1)
                keysBoxLayout.add_child(new St.Label({style_class: 'right_arrow', text: '→'}));
        }

        const descriptionBoxLayout = new St.BoxLayout({
            style_class: 'description-boxlayout',
            pack_start: false,
            vertical: false,
        });
        descriptionBoxLayout.add_child(new St.Label({style_class: 'description', text: shortcut.description}));

        const boxLayouts = this._settings.get_boolean('show-description-first')
            ? [descriptionBoxLayout, keysBoxLayout]
            : [keysBoxLayout, descriptionBoxLayout];

        for (const boxLayout of boxLayouts)
            shortcutBoxLayout.add_child(boxLayout);

        return shortcutBoxLayout;
    }

    /**
     * Toggles the overlay visibility
     *
     * @function _toggleOverlay
     * @public
     */
    toggleOverlay() {
        if (!this._isVisible)
            this._showOverlay();
        else
            this._hideOverlay();
    }

    /**
     * Clean up stuff which is not cleaned up automatically.
     *
     * @function
     * @public
     */
    destroy() {
        this._isVisible = false;
        this._fileReader.destroy();

        super.destroy();
    }
}
