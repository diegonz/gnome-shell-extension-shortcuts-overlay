/* eslint-disable no-unused-vars,@typescript-eslint/ban-ts-comment,@typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols

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
const Me = ExtensionUtils.getCurrentExtension();

import {Daemon} from './daemon';

let daemon: Daemon | null = null;

/**
 * This function is called when your extension is enabled, which could be
 * done in GNOME Extensions, when you log in or when the screen is unlocked.
 *
 * This is when you should set up any UI for your extension, change existing
 * widgets, connect signals or modify GNOME Shell's behaviour.
 */
// @ts-ignore
function enable() {
    daemon = new Daemon();
}

/**
 * This function is called when your extension is uninstalled, disabled in
 * GNOME Extensions, when you log out or when the screen locks.
 *
 * Anything you created, modified or setup in enable() MUST be undone here.
 * Not doing so is the most common reason extensions are rejected in review!
 */
// @ts-ignore
function disable() {
    if (daemon)
        daemon.destroy();

    daemon = null;
}

/**
 * This function is called once when your extension is loaded, not enabled. This
 * is a good time to set up translations or anything else you only do once.
 *
 * You MUST NOT make any changes to GNOME Shell, connect any signals or add any
 * MainLoop sources here.
 *
 * @type {Function}
 */
// @ts-ignore
function init() {
    ExtensionUtils.initTranslations(Me.metadata['gettext-domain']);
}
