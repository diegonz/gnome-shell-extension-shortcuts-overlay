// GNOME typedefs

/**
 * @typedef Gdk.Event.get_keyval
 * @type {function}
 * @returns {[boolean, number]}
 */

/**
 * @typedef Gdk.Event
 * @type {Object}
 * @property {number} keyval
 * @property {Gdk.Event.get_keyval} get_keyval
 */

/**
 * @typedef Gdk
 * @type {Object}
 * @property {Gdk.Event} Event
 */

/**
 * @typedef native
 * @type {Object}
 * @property {function} get_file
 */

/**
 * @typedef Config
 * @type {Object}
 * @property {string} PACKAGE_VERSION
 */

/**
 * @typedef toString
 * @type {function}
 * @param {Object|function|number|boolean} target
 * @return string
 */

/**
 * @typedef Me.dir.get_child
 * @type {function}
 * @return {File|Object}
 */

/**
 * @typedef Me
 * @type {Object}
 * @property {ExtensionMetadataJson} metadata
 * @property {dir} dir
 * @property {Me.dir.get_child} dir.get_child
 * @property {Object} imports
 * @property {Object} imports.modules
 * @property {Object} imports.modules.extension
 * @property {Extension|function(new:Extension)} imports.modules.extension.Extension
 * @property {Object} imports.modules.daemon
 * @property {Daemon|function(new:Daemon)} imports.modules.daemon.Daemon
 * @property {Object} imports.modules.overlay
 * @property {Overlay|function(new:Overlay)} imports.modules.overlay.Overlay
 * @property {Object} imports.modules.shortcuts
 * @property {Shortcuts|function(new:Shortcuts)} imports.modules.shortcuts.Shortcuts
 * @property {Object} imports.modules.logger
 * @property {Logger|function(new:Logger)} imports.modules.logger.Logger
 */

/**
 * @typedef getCurrentExtension
 * @type {function}
 * @returns {Me}
 */

/**
 * @typedef getSettings
 * @type {function}
 * @param {string} [schema]
 * @returns {ExtensionSettings}
 */

/**
 * @typedef ExtensionUtils
 * @type {Object}
 * @property {getCurrentExtension} getCurrentExtension
 * @property {function} initTranslations
 * @property {getSettings} getSettings
 */

/**
 * @typedef Misc
 * @type {Object}
 * @property {Config} config
 * @property {ExtensionUtils} extensionUtils
 */

/**
 * @typedef ui
 * @type {Object}
 * @property {Main} main
 * @property {Object} Main.layoutManager
 * @property {Object} Main.layoutManager.primaryMonitor
 * @property {Object} Main.uiGroup
 * @property {function} Main.uiGroup.add_actor
 * @property {function} Main.uiGroup.add_child
 * @property {Object} Main.wm
 * @property {function} Main.wm.setCustomKeybindingHandler
 * @property {Object} Main.overview
 * @property {Object} Main.overview._specialToggle
 * @property {function} Main.overview._specialToggle.bind
 * @property {Object} Main.panel
 * @property {Object} Main.panel._rightBox
 * @property {function} Main.panel._rightBox.remove_child
 * @property {function} Main.panel._rightBox.insert_child_at_index
 * @property {function} Main.notify
 * @property {function} Main.notifyError
 * @property {Object} tweener
 * @property {function} tweener.addTween
 */

/**
 * @typedef FileTest
 * @type {Object}
 * @property {boolean} EXISTS
 */

/**
 * @typedef GLib
 * @type {Object}
 * @property {FileTest} FileTest
 * @property {function} file_test
 */

/**
 * @typedef load_contents
 * @type {function}
 * @param {string|null} path
 * @returns {[boolean, Object]}
 */

/**
 * @typedef File
 * @type {Object}
 * @property {load_contents} load_contents
 * @property {function} get_path
 */

/**
 * @typedef file_new_for_path
 * @type {function}
 * @returns {File}
 */

/**
 * @typedef Gio
 * @type {Object}
 * @property {function} file_new_for_path
 */

/**
 * @typedef BoxLayout
 * @type {Object}
 * @property {function} add_actor
 * @property {function} add_child
 * @property {function} remove_actor
 * @property {function} set_background_color
 * @property {function} set_position
 * @property {number} width
 * @property {number} height
 * @returns {BoxLayout}
 */

/**
 * @typedef Bin
 * @type {Object}
 * @property {function} set_child
 * @returns {Bin}
 */

/**
 * @typedef St
 * @type {Object}
 * @property {Bin|function} Bin
 * @property {BoxLayout|function} BoxLayout
 * @property {Object|function} Icon
 * @property {Object|function} Widget
 * @property {Object|function} Label
 */

/**
 * @typedef Color
 * @type {Object}
 */

/**
 * @typedef Clutter
 * @type {Object}
 * @property {Color} Color
 */

/**
 * @typedef GObjectClass
 * @type {Grid|Object|function}
 * @property {string} Name
 * @property {string} GTypeName
 * @property {Object} Extends
 * @property {function} _init
 * @property {function} show_all
 * @param {GObjectClass} klass
 * @returns {GObjectClass}
 */

/**
 * @typedef GObject
 * @type {Object}
 * @property {GObjectClass|function} Class
 * @property {function} registerClass
 */

/**
 * @typedef get_uri
 * @type {function}
 * @returns {string}
 */

/**
 * @typedef FileChooserButton
 * @type {Object|function}
 * @property {function} select_uri
 * @property {function} set_filter
 * @property {function} add_mime_type
 * @property {get_uri} get_uri
 * @param {Object} params
 * @returns {FileChooserButton}
 */

/**
 * @typedef GtkWidget
 * @type {Object}
 * @property {function} set_active
 * @property {function} get_active
 * @property {function} get_root
 * @property {function} get_value
 */

/**
 * @typedef Box
 * @type {Object|function(new:Box)}
 * @property {function} _
 * @property {Object} _custom_file_checkbox
 * @property {function} _custom_file_checkbox.set_active
 * @property {Object} _tray_icon_checkbox
 * @property {function} _tray_icon_checkbox.set_active
 * @property {Object} _transparency_checkbox
 * @property {function} _transparency_checkbox.set_active
 * @property {Object} _file_chooser_button
 * @property {function} _file_chooser_button.set_label
 * @property {Object} _file_chooser
 * @property {function} _file_chooser.set_transient_for
 * @property {function} set_orientation
 * @property {FileChooserButton} FileChooserButton
 * @property {Object} FileChooserAction
 * @property {Object|function} FileFilter
 * @param {Object} config
 * @returns {Box}
 */

/**
 * @typedef Gtk.Grid.attach
 * @type {function}
 * @property {function} attach
 * @param {Gtk.Widget} child
 * @param {number} left
 * @param {number} top
 * @param {number} width
 * @param {number} height
 */

/**
 * @typedef Gtk.Grid
 * @type {Object}
 * @property {Gtk.Grid.attach} attach
 * @property {function} set_orientation
 * @property {FileChooserButton|function(new:FileChooserButton)} FileChooserButton
 * @property {Object} FileChooserAction
 * @property {Object|function} FileFilter
 */

/**
 * @typedef Gtk.Scale.new_with_range
 * @type {function}
 * @param {Gtk.Orientation} orientation
 * @param {number} min
 * @param {number} max
 * @param {number} step
 * @returns {Gtk.Scale}
 */

/**
 * @typedef Gtk.Scale
 * @type {function}
 * @property {new_with_range} Scale.new_with_range
 * @property {number} Scale.value
 * @property {function} Scale.set_value
 * @property {function} Scale.set_digits
 * @property {function} Scale.set_hexpand
 * @property {function} Scale.set_draw_value
 * @property {function} Scale.add_mark
 * @property {function} Scale.set_size_request
 */

/**
 * @typedef Gtk
 * @type {Object}
 * @property {Object} ResponseType
 * @property {number} ResponseType.ACCEPT
 * @property {Object|function(new:Box)} Box
 * @property {Object} Grid
 * @property {Scale} Scale
 * @property {Object} Orientation
 * @property {number} Orientation.HORIZONTAL
 * @property {number} Orientation.VERTICAL
 * @property {Object} PositionType
 * @property {number} PositionType.TOP
 * @property {number} PositionType.BOTTOM
 * @property {Object|function} CheckButton
 * @property {FileChooserButton|function(new:FileChooserButton)} FileChooserButton
 * @property {Object} FileChooserAction
 * @property {Object|function} FileFilter
 */

/**
 * @typedef gi
 * @type {Object}
 * @property {Gio} Gio
 * @property {Object} Gio.SettingsBindFlags
 * @property {number} Gio.SettingsBindFlags.DEFAULT
 * @property {GLib} GLib
 * @property {GObject} GObject
 * @property {Gtk} Gtk
 * @property {Object} Shell
 * @property {Object} Shell.ActionMode
 * @property {Object} Shell.ActionMode.NORMAL
 * @property {Object} Shell.ActionMode.OVERVIEW
 * @property {St} St
 * @property {Clutter} Clutter
 */

/**
 * @typedef ByteArray
 * @type {Object}
 * @property {toString} toString
 */

/**
 * @typedef imports
 * @type {Object}
 * @property {gi} gi
 * @property {ui} ui
 * @property {Misc} misc
 * @property {Object} gettext
 * @property {ByteArray} byteArray
 */

// Extension typedefs

/** @typedef Shortcut
 * @type {Object}
 * @property {string} name
 * @property {string} description
 */

/** @typedef ShortcutGroup
 * @type {Object}
 * @property {string} name
 * @property {Shortcut[]} shortcuts
 */

/** @typedef ShortcutsJsonFileData
 * @type {Object}
 * @property {ShortcutGroup[]} shortcutGroups
 */

/**
 * @typedef ExtensionMetadataJson
 * @type {Object}
 * @property {string} _generated
 * @property {string} description - the extension description
 * @property {string} gettext-domain - the extension gettext domain
 * @property {string} name - the extension name
 * @property {string} settings-schema - the extension settings schema
 * @property {string[]} shell-version - a list of supported Gnome Shell versions
 * @property {string[]} session-modes - a list of supported session modes
 * @property {string} url - the extension website
 * @property {string} uuid - the extension UUID
 * @property {number} version - the extension version
 */

/**
 * @typedef ExtensionMeta
 * @type {Object}
 * @property {ExtensionMetadataJson} metadata - the metadata.json file, parsed as JSON
 * @property {string} uuid - the extension UUID
 * @property {number} type - the extension type; `1` for system, `2` for user
 * @property {Gio.File} dir - the extension directory
 * @property {string} path - the extension directory path
 * @property {string} error - an error message or an empty string if no error
 * @property {boolean} hasPrefs - whether the extension has a preferences dialog
 * @property {boolean} hasUpdate - whether the extension has a pending update
 * @property {boolean} canChange - whether the extension can be enabled/disabled
 * @property {string[]} sessionModes - a list of supported session modes
 */

/**
 * @typedef Settings
 * @type {Object}
 * @property {boolean} use-custom-file - If true the shortcut file specified as shortcuts-file will be used for custom shortcuts
 * @property {string} shortcuts-file - If not empty it points to the shortcut file that will be read for the shortcut descriptions
 * @property {boolean} show-icon - If true an icon to activate the extension will be visible on the top panel
 * @property {boolean} use-transparency - If true transparency will be applied to the shortcuts dialog
 * @property {number} visibility - Visibility value. Values between 0 and 100 are allowed. 0 is invisible and 100 is fully visible
 */

/**
 * @typedef get_boolean
 * @type {function}
 * @param {string} key
 * @returns {boolean}
 */

/**
 * @typedef set_boolean
 * @type {function}
 * @param {string} key
 * @param {string} value
 */

/**
 * @typedef get_int
 * @type {function}
 * @param {string} key
 * @returns {number}
 */

/**
 * @typedef set_int
 * @type {function}
 * @param {string} key
 * @param {string} value
 */

/**
 * @typedef get_string - Get a string value from the settings
 * @type {function}
 * @param {string} key - The key of the setting
 * @returns {string} - The value of the setting
 */

/**
 * @typedef set_string - Sets the value of a string key
 * @type {function}
 * @param {string} key - the key to set
 * @param {string} value - the value to set
 */

/**
 * @typedef ExtensionSettings
 * @type {Object}
 * @property {function} connect
 * @property {function} bind
 * @property {function} disconnect
 * @property {get_boolean} get_boolean
 * @property {set_boolean} set_boolean
 * @property {get_int} get_int
 * @property {set_int} set_int
 * @property {get_string} get_string
 * @property {set_string} set_string
 */
