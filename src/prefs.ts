/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment */
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

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

import * as Gtk from 'gnome-typescript-types/gtk';
import * as Gio from 'gnome-typescript-types/gio';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.metadata['gettext-domain']).gettext;

/**
 * The extension settings.
 */
const settings = ExtensionUtils.getSettings();

/**
 * Builds a Gtk.Box with given Gtk.Widgets as children.
 *
 * @param {...Gtk.Widget} gtkWidgets - The Gtk.Widgets to add to the box.
 */
function createBox(...gtkWidgets: Gtk.Widget[]): Gtk.Box {
    const gtkBox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, spacing: 10});

    for (const [index, gtkWidget] of gtkWidgets.entries()) {
        if (index === 0)
            gtkBox.pack_start(gtkWidget, true, true, 0);
        else
            gtkBox.add(gtkWidget);
    }

    return gtkBox;
}

/**
 * Creates a Gtk.Label with given text.
 *
 * @param {string} labelText - The text to display on the label.
 */
function createLabel(labelText: string): Gtk.Label {
    return new Gtk.Label({label: labelText, xalign: 0});
}

/**
 * Creates a Gtk.Switch.
 *
 * @param {string} schemaKey - The schema key to bind the switch to.
 */
function createSwitch(schemaKey: string): Gtk.Switch {
    const gtkSwitch = new Gtk.Switch();
    settings.bind(schemaKey, gtkSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

    return gtkSwitch;
}

/**
 * Creates a Gtk.FileChooserButton.
 *
 * @param {string} schemaKey - The schema key to bind the file chooser button to.
 * @param {string} buttonText - The text to display on the button.
 */
function createFileChooserButton(schemaKey: string, buttonText: string): Gtk.Widget {
    const fileChooserButton = new Gtk.FileChooserButton({
        title: _(buttonText),
        action: Gtk.FileChooserAction.OPEN,
        hexpand: true,
    });
    fileChooserButton.select_uri(`file://${settings.get_string('shortcuts-file')}`);
    const shortcutsFileFilter = new Gtk.FileFilter();
    fileChooserButton.set_filter(shortcutsFileFilter);
    shortcutsFileFilter.add_mime_type('application/json');
    fileChooserButton.connect('selection_changed', button => settings.set_string(schemaKey, button.get_uri().slice(7)));

    return fileChooserButton;
}

/**
 * Creates a Gtk.Scale.
 *
 * @param {string} schemaKey - The schema key to bind the scale to.
 * @param {number} min - The minimum value of the scale.
 * @param {number} max - The maximum value of the scale.
 * @param {number} step - The step value of the scale.
 */
function createScale(schemaKey: string, min: number, max: number, step: number): Gtk.Scale {
    const gtkScale = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, min, max, step);
    gtkScale.set_value(settings.get_int(schemaKey));
    gtkScale.set_digits(0);
    gtkScale.set_hexpand(true);
    gtkScale.connect('value-changed', scale => settings.set_int(schemaKey, scale.get_value()));

    return gtkScale;
}

/**
 * Initializes the extension preferences.
 */
// @ts-ignore
function init() {
    ExtensionUtils.initTranslations(Me.metadata['gettext-domain']);
}

/**
 * Builds the extension preferences widget.
 */
// @ts-ignore
function buildPrefsWidget(): Gtk.Widget {
    const widget = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, border_width: 12, spacing: 12, margin: 12});

    const widgetGroups = [
        [
            createLabel(_('Use custom Shortcuts File')),
            createSwitch('use-custom-file'),
        ],
        [
            createLabel(_('Custom Shortcuts File')),
            createFileChooserButton('shortcuts-file', 'Select shortcut file'),
        ],
        [
            createLabel(_('Panel count')),
            createScale('inner-boxlayout-count', 1, 4, 1),
        ],
        [
            createLabel(_('Show shortcut description before key combination')),
            createSwitch('show-description-first'),
        ],
    ];

    for (const widgets of widgetGroups)
        widget.add(createBox(...widgets));


    if (widget.show_all())
        widget.show_all();

    return widget;
}
