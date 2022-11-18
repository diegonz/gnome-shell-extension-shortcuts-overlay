'use strict';

/* prefs.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Extension.metadata["gettext-domain"]).gettext;

/**
 * @type {GObjectClass|function(new:GObjectClass)|Gtk.Grid|function(new:Gtk.Grid)}
 */
const ShortcutsOverlayPreferencesGridWidget = new GObject.Class({
    Name: "ShortcutsOverlay_Preferences_Widget",
    GTypeName: "ShortcutsOverlay_Preferences_Widget",
    Extends: Gtk.Grid,

    _init: function (params) {
        this.parent(params);
        // noinspection JSUnusedGlobalSymbols
        this.margin = this.row_spacing = this.column_spacing = 12;
        this.set_orientation(Gtk.Orientation.VERTICAL);

        this._settings = ExtensionUtils.getSettings();

        const customFileCheckButton = new Gtk.CheckButton({label: _("Custom Shortcuts File")});
        this._settings.bind("use-custom-file", customFileCheckButton, "active", Gio.SettingsBindFlags.DEFAULT);

        const shortcutsFileChooserButton = new Gtk.FileChooserButton({title: _("Select shortcut file"), action: Gtk.FileChooserAction.OPEN, hexpand: true});
        shortcutsFileChooserButton.select_uri("file://" + this._settings.get_string("shortcuts-file"));
        const shortcutsFileFilter = new Gtk.FileFilter();
        shortcutsFileChooserButton.set_filter(shortcutsFileFilter);
        shortcutsFileFilter.add_mime_type("application/json");
        shortcutsFileChooserButton.connect("selection_changed", () => this._settings.set_string("shortcuts-file", shortcutsFileChooserButton.get_uri().slice(7)));

        const innerBoxLayoutCountLabel = new Gtk.Label({label: _("Panel count")});
        const innerBoxLayoutCountScale = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 1, 4, 1);
        innerBoxLayoutCountScale.set_value(this._settings.get_int('inner-boxlayout-count'));
        innerBoxLayoutCountScale.set_digits(0);
        innerBoxLayoutCountScale.set_hexpand(true);
        // this._settings.bind("inner-boxlayout-count", innerBoxLayoutCountScale, "value", Gio.SettingsBindFlags.DEFAULT);
        // innerBoxLayoutCountScale.connect('value-changed', () => this._settings.set_int('inner-boxlayout-count', innerBoxLayoutCountScale.get_value()));
        innerBoxLayoutCountScale.connect('value-changed', (scale) => this._settings.set_int('inner-boxlayout-count', scale.get_value()));

        this.attach(customFileCheckButton, 0, 0, 1, 1);
        this.attach(shortcutsFileChooserButton, 1, 0, 1, 1);
        this.attach(innerBoxLayoutCountLabel, 0, 1, 1, 1);
        this.attach(innerBoxLayoutCountScale, 1, 1, 1, 1);
    },
});

// noinspection JSUnusedGlobalSymbols
/**
 * Like `extension.js` this is used for any one-time setup like translations.
 */
function init() {
    ExtensionUtils.initTranslations(Extension.metadata["gettext-domain"]);
}

// noinspection JSUnusedGlobalSymbols
function buildPrefsWidget() {
    const widget = new ShortcutsOverlayPreferencesGridWidget();

    // At the time buildPrefsWidget() is called, the window is not yet prepared so if you want to access the headerbar you need to use a small trick
    GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
        const Config = imports.misc.config;
        const [major] = Config.PACKAGE_VERSION.split('.');
        const shellVersion = Number.parseInt(major);
        const window = shellVersion < 40 ? widget.get_toplevel() : widget.get_root();
        const headerBar = window.get_titlebar();
        headerBar.title = `${Extension.metadata.name} Extension Preferences`;

        return GLib.SOURCE_REMOVE;
    });

    if (widget.show_all()) {
        widget.show_all();
    }
    return widget;
}

// noinspection JSUnusedGlobalSymbols
/**
 * This will have priority over buildPrefsWidget on GNOME versions greater than 42.
 *
 * @return GObjectClass
 */
function fillPreferencesWindow() {
    return buildPrefsWidget();
}
