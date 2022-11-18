'use strict';

const {Gio, GLib, St} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.metadata["gettext-domain"]).gettext;
const Main = imports.ui.main;

const Extension = Me.imports.modules.extension.Extension;
const Shortcuts = Me.imports.modules.shortcuts.Shortcuts;

// noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
var Overlay = class Overlay extends Extension { // NOSONAR
    constructor() {
        super();

        /**
         * Flag indicating whether the overlay is visible or not
         * @type {boolean}
         * @private
         */
        this._isVisible = false;

        /**
         * The BoxLayout container
         * @type {BoxLayout|Object}
         * @private
         */
        this._containerBoxLayout = null;

        /**
         * The shortcuts file handler
         * @type {Shortcuts}
         * @private
         */
        this._shortcuts = new Shortcuts();
    }

    /**
     * Shows the overlay
     * @method _showOverlay
     * @private
     */
    _showOverlay() {
        if (!this._containerBoxLayout) {
            this._containerBoxLayout = this._buildOverlayContents();
        }

        Main.uiGroup.add_child(this._containerBoxLayout);

        const monitor = Main.layoutManager.primaryMonitor;
        const xPosition = monitor.x + Math.floor(monitor.width / 2 - this._containerBoxLayout.width / 2);
        const yPosition = monitor.y + Math.floor(monitor.height / 2 - this._containerBoxLayout.height / 2);
        this._containerBoxLayout.set_position(xPosition, yPosition);

        this._isVisible = true;
    }

    /**
     * Builds and returns the overlay contents
     * @method _createOverlayContents
     * @return {BoxLayout}
     * @private
     */
    _buildOverlayContents() {
        const container = new St.BoxLayout({style_class: "background", pack_start: false, vertical: true});
        const wrapper = new St.BoxLayout({style_class: "panel-boxlayout", pack_start: false, vertical: false});
        container.add_child(wrapper);

        for (const inner of this._buildInnerBoxLayouts()) {
            wrapper.add_child(inner);
        }

        return container;
    }

    /**
     * Hides the overlay by removing the actors
     * @method _hideOverlay
     * @private
     */
    _hideOverlay() {
        Main.uiGroup.remove_child(this._containerBoxLayout);
        this._containerBoxLayout = null;
        this._isVisible = false;
    }

    /**
     * Builds and returns the inner box layouts for overlay
     * @method _createInnerBoxLayouts
     * @return {BoxLayout[]}
     * @private
     */
    _buildInnerBoxLayouts() {
        const innerBoxLayoutCount = this._settings.get_int("inner-boxlayout-count");
        const progressStep = (1 / innerBoxLayoutCount);
        let progress = 0.0;
        let target = 0;
        const shortcutGroups = this._shortcuts.getShortcutGroups();
        const totalShortcuts = shortcutGroups.reduce((count, current) => count + current.shortcuts.length, 0);

        /**
         * @type {BoxLayout[]}
         */
        const innerBoxLayouts = [];

        for (let i = 0; i < innerBoxLayoutCount; i++) {
            innerBoxLayouts.push(new St.BoxLayout({
                style_class: "inner-boxlayout",
                pack_start: false,
                vertical: true
            }));
        }

        for (const {name, shortcuts} of shortcutGroups) {
            const currentProgressStep = progressStep * (target + 1);
            target = progress < currentProgressStep ? target : target + 1;
            progress += shortcuts.length / totalShortcuts;

            innerBoxLayouts[target].add_actor(new St.Label({style_class: "group", text: name}));
            for (const shortcut of shortcuts) {
                innerBoxLayouts[target].add_actor(this._createShortcutBoxLayout(shortcut));
            }
        }

        return innerBoxLayouts;
    }

    /**
     * Builds and returns a BoxLayout for a shortcut
     * @param {Shortcut} shortcut
     * @returns {BoxLayout}
     * @private
     */
    _createShortcutBoxLayout(shortcut) {
        const boxLayout = new St.BoxLayout({style_class: "shortcut", pack_start: false, vertical: false});
        const keysBoxLayout = new St.BoxLayout({style_class: "keys", pack_start: false, vertical: false});
        const keys = shortcut.name.split("+").map(key => key.trim());
        for (const [index, key] of keys.entries()) {
            keysBoxLayout.add_actor(new St.Label({style_class: "kbd", text: key}));
            if (index < keys.length - 1) {
                keysBoxLayout.add_actor(new St.Label({style_class: "plus", text: "+"}));
            }
        }

        // const keysLabel = new St.Label({style_class: "name", text: keys})
        // keysLabel.get_clutter_text().set_use_markup(true);
        boxLayout.add(keysBoxLayout);
        boxLayout.add(new St.Label({style_class: "description", text: _(shortcut.description)}));

        return boxLayout;
    }

    /**
     * Toggles the overlay visibility
     * @method _toggleOverlay
     * @public
     */
    toggleOverlay() {
        if (!this._isVisible) {
            this._showOverlay();
        } else {
            this._hideOverlay();
        }
    }

    /**
     * Clean up stuff which is not cleaned up automatically.
     * @function
     * @public
     */
    destroy() {
        this._isVisible = false;
        this._shortcuts.destroy();

        super.destroy();
    }
}
