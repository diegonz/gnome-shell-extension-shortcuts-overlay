/* eslint-disable no-var */
// noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols

import * as Clutter from 'gnome-typescript-types/clutter';
import * as Gio from 'gnome-typescript-types/gio';
import * as GLib from 'gnome-typescript-types/glib';
import * as GObject from 'gnome-typescript-types/gobject';
import * as Gtk from 'gnome-typescript-types/gtk';
import * as Shell from 'gnome-typescript-types/shell';
import * as St from 'gnome-typescript-types/st';
import * as Meta from 'gnome-typescript-types/meta';
import * as ByteArray from 'gnome-typescript-types/byteArray';
import * as ExtensionUtils from 'gnome-typescript-types/misc/extensionUtils';
import * as Main from 'gnome-typescript-types/ui/main';

import {AbstractExtension} from './abstractExtension';
import {Daemon} from './daemon';
import {FileReader} from './fileReader';
import {Overlay} from './overlay';

declare global {
    var imports: imports;
    var log: (arg: unknown) => void;
    var logError: (error: unknown) => void;
    var display: Meta.Display;
    var stage: Clutter.Actor;
    var window_group: Clutter.Actor;
    var window_manager: Meta.WindowManager;
    var workspace_manager: Meta.WorkspaceManager;
}

export interface imports {
    misc: {
        extensionUtils: typeof ExtensionUtils;
    };

    ui: {
        main: typeof Main;
    };

    gi: {
        Clutter: typeof Clutter;
        GLib: typeof GLib;
        GObject: typeof GObject;
        Gio: typeof Gio;
        Gtk: typeof Gtk;
        Meta: typeof Meta;
        Shell: typeof Shell;
        St: typeof St;
    };

    gettext: {
        domain(domain: string): {
            gettext: (text: string) => string;
        }
    };

    byteArray: typeof ByteArray;
}

export interface Me {
    imports: {
        abstractExtension: { AbstractExtension: AbstractExtension };
        daemon: { Daemon: Daemon };
        overlay: { Overlay: Overlay };
        fileReader: { FileReader: FileReader };
    };
    metadata: Metadata;
    dir: Gio.File;
}

declare class Metadata {
    'description': string;
    'gettext-domain': string;
    'name': string;
    'settings-schema': string;
    'shell-version': Array<string>;
    'session-modes': Array<string>;
    'url': string;
    'uuid': string;
    'version': number;
}

export interface ShortcutSpec {
    keys: Array<Array<string>>;
    description: string;
}

export interface ShortcutGroupSpec {
    name: string;
    shortcuts: ShortcutSpec[];
}
