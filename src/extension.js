'use strict';

/* extension.js
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

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Daemon = Extension.imports.modules.daemon.Daemon;

let daemon;

/**
 * This function is called once when your extension is loaded, not enabled. This
 * is a good time to set up translations or anything else you only do once.
 *
 * You MUST NOT make any changes to GNOME Shell, connect any signals or add any
 * MainLoop sources here.
 *
 * @type {function}
 * @param {ExtensionMeta} [meta] - An extension-meta object, described below.
 */
function init(meta) {
    ExtensionUtils.initTranslations();
}

/**
 * This function could be called after the extension is enabled, which could be done from
 * GNOME Tweaks, when you log in or when the screen is unlocked. We create an instance of
 * the Daemon class
 */
function enable() {
    daemon = new Daemon();
}

/**
 * This function could be called after the extension is uninstalled, disabled in GNOME
 * Tweaks, when you log out or when the screen locks. It deletes the previously created
 * daemon.
 */
function disable() {
    daemon.destroy();
    daemon = null;
}
