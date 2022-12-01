AUTHOR = Diego González
AUTHOR_EMAIL = diegonz@github.io
AUTHOR_TEXT = $(AUTHOR) <$(AUTHOR_EMAIL)>
CURRENT_DATE = $(shell date +"%Y-%m-%d %H:%M:%S%z")
CURRENT_YEAR = $(shell date +"%Y")

## Set up folder variables
ROOT_FOLDER = $(shell dirname $(MAKEFILE_LIST))
SRC_FOLDER = $(ROOT_FOLDER)/src
LOCALE_FOLDER = $(SRC_FOLDER)/locale
SCHEMAS_FOLDER = $(SRC_FOLDER)/schemas
BUILD_FOLDER = $(ROOT_FOLDER)/build
SCHEMAS_BUILD_FOLDER = $(BUILD_FOLDER)/schemas
LOCALE_BUILD_FOLDER = $(BUILD_FOLDER)/locale
DIST_FOLDER = $(ROOT_FOLDER)/dist

## Set up config file variables
METADATA_FILE = $(SRC_FOLDER)/metadata.json
SHORTCUTS_FILE = $(SRC_FOLDER)/shortcuts.json
TSCONFIG_FILE = $(ROOT_FOLDER)/tsconfig.json

## Retrieve extension info from ``metadata.json`` and ``tsconfig.json``
EXT_UUID = $(shell grep -E '^[ ]*"uuid":' $(METADATA_FILE) | sed 's@^[ ]*"uuid":[ ]*"\(.\+\)",[ ]*@\1@')
EXT_VERSION = $(shell grep -E '^[ ]*"version":' $(TSCONFIG_FILE) | awk -F'"' '{print $$4}')
EXT_MAJOR_VERSION = $(shell grep -E '^[ ]*"version":' $(TSCONFIG_FILE) | awk -F'"' '{print $$4}' | cut -d. -f1)
EXT_GETTEXT_DOMAIN = $(shell grep -E '^[ ]*"gettext-domain":' $(METADATA_FILE) | sed 's@^[ ]*"gettext-domain":[ ]*"\(.\+\)",*[ ]*@\1@')
EXT_NAME = $(shell grep -E '^[ ]*"name":' $(METADATA_FILE) | sed 's@^[ ]*"name":[ ]*"\(.\+\)",*[ ]*@\1@')
EXT_DESCRIPTION = $(shell grep -E '^[ ]*"description":' $(METADATA_FILE) | sed 's@^[ ]*"description":[ ]*"\(.\+\)",*[ ]*@\1@')
EXT_POT_FILENAME = $(EXT_GETTEXT_DOMAIN).pot
EXT_POT_FILE = $(LOCALE_FOLDER)/$(EXT_POT_FILENAME)
EXT_BUILD_POT_FILE = $(LOCALE_BUILD_FOLDER)/$(EXT_POT_FILENAME)

EXT_GIT_REPO_URL = $(shell git -C $(ROOT_FOLDER) remote get-url origin)

## Define target install paths
ifeq ($(XDG_DATA_HOME),)
XDG_DATA_HOME = $(HOME)/.local/share
endif
ifeq ($(strip $(DESTDIR)),)
INSTALL_BASE = $(XDG_DATA_HOME)/gnome-shell/extensions
else
INSTALL_BASE = $(DESTDIR)/usr/share/gnome-shell/extensions
endif

$(info GNOME Shell extension: $(EXT_NAME))
$(info Extension Description: $(EXT_DESCRIPTION))
$(info Extension version: $(EXT_VERSION))
$(info Extension UUID: $(EXT_UUID))

.PHONY: all clean install zip

SOURCES = $(SRC_FOLDER)/*.ts $(SRC_FOLDER)/*.css

all: check_dependencies compile generate_pot clean_build_folder

clean:
	@echo -n "[ℹ] Cleaning up... "
	@rm -rf $(BUILD_FOLDER) $(DIST_FOLDER)
	@echo "Done. ✔"

## https://gjs.guide/extensions/review-guidelines/review-guidelines.html#don-t-include-unnecessary-files
clean_build_folder:
	@echo -n "[ℹ] Cleaning up $(BUILD_FOLDER) ... "
	@rm -f "$(LOCALE_BUILD_FOLDER)"/*.pot \
		"$(LOCALE_BUILD_FOLDER)"/LINGUAS \
		"$(LOCALE_BUILD_FOLDER)"/*/LC_MESSAGES/*.po \
		"$(LOCALE_FOLDER)"/*/LC_MESSAGES/*.mo \
		"$(SCHEMAS_BUILD_FOLDER)"/*.xml \
		"$(BUILD_FOLDER)"/*.tsbuildinfo
	@echo "Done. ✔"

# Configure local settings on system
configure:
	@echo "[ℹ] Nothing to configure. Skipping..."
	@#sh scripts/configure.sh

generate_pot: compile
	@echo -n "[ℹ] Generating POT file... "
	@xgettext \
		--package-name="$(EXT_UUID)" \
		--package-version="$(EXT_VERSION)" \
		--copyright-holder="$(AUTHOR)" \
		--msgid-bugs-address="$(AUTHOR_EMAIL)" \
		--add-comments=. \
		--sort-by-file \
		--from-code=UTF-8 \
		--no-wrap \
		--output="$(EXT_BUILD_POT_FILE)" \
		"$(BUILD_FOLDER)/extension.js" \
		"$(BUILD_FOLDER)/abstractExtension.js" \
		"$(BUILD_FOLDER)/daemon.js" \
		"$(BUILD_FOLDER)/overlay.js" \
		"$(BUILD_FOLDER)/fileReader.js" \
		"$(BUILD_FOLDER)/prefs.js" \
		"$(SCHEMAS_BUILD_FOLDER)/org.gnome.shell.extensions.shortcuts-overlay.gschema.xml" ; \
	cat $(EXT_BUILD_POT_FILE) | \
		sed "s/SOME DESCRIPTIVE TITLE/$(EXT_NAME): $(EXT_DESCRIPTION)/" | \
		sed "s/YEAR-MO-DA HO:MI+ZONE/$(CURRENT_DATE)/" | \
		sed "s/YEAR/$(CURRENT_YEAR)/" | \
		sed -E -e "s/<EMAIL@ADDRESS>|<LL@li.org>/<$(AUTHOR_EMAIL)>/" | \
		sed -E -e "s/FIRST AUTHOR|FULL NAME|LANGUAGE/$(AUTHOR)/" | \
		sed "s/Language: /Language: en/" \
		> $(EXT_BUILD_POT_FILE).tmp && \
	mv $(EXT_BUILD_POT_FILE).tmp $(EXT_BUILD_POT_FILE) && \
	cp $(EXT_BUILD_POT_FILE) $(EXT_POT_FILE)
	@echo "Done. ✔"

compile: $(SOURCES) clean
	@echo "[ℹ] Compiling $(EXT_UUID) extension ..."
	@rm -rf "$(BUILD_FOLDER)"
	@echo -n "    Compiling schemas... "
	@glib-compile-schemas --targetdir="$(SCHEMAS_FOLDER)" "$(SCHEMAS_FOLDER)"
	@echo "Done. ✔"
	@mkdir -p "$(BUILD_FOLDER)"
	@echo -n "    Updating extension version... "
	@sed -i "s/\"version\"\: [[:digit:]]/\"version\"\: $(EXT_MAJOR_VERSION)/" $(METADATA_FILE)
	@echo "Done. ✔"
	@echo -n "    Transpiling to JavaScript... "
	@tsc
	@echo "Done. ✔"
	@wait
	@echo -n "    Copying files to build folder... "
	@cp -r "$(METADATA_FILE)" "$(SCHEMAS_FOLDER)" "$(LOCALE_FOLDER)" "$(SRC_FOLDER)"/*.css "$(SHORTCUTS_FILE)" "$(BUILD_FOLDER)"
	@echo "Done. ✔"
	@echo -n "    Converting JavaScript to GJS-compatible scripts..."
	@## https://stackoverflow.com/q/7935512/3799840
	@for source_file in $$(find "$(BUILD_FOLDER)" -type f -name '*.js'); do \
		cat "$${source_file}" | \
			sed -e 's#export function#function#g' \
				-e 's#export var#var#g' \
				-e 's#export const#var#g' \
				-e 's#Object.defineProperty(exports, "__esModule", { value: true });#var exports = {};#g' | \
			sed -E 's/export class (\w+)/var \1 = class \1/g' | \
			sed -E "s/import \* as (\w+) from 'gnome-typescript-types\/\w+'/const \1 = imports.gi.\1/g" | \
			sed -E "/import \{(\w+)\} from '\.\/index'/d" | \
			sed -E "s/import \{\s?(\w+)\s?\} from '\.\/(\w+)'/const \1 = Me.imports.\2.\1/g" | \
			sed -E "s/import \* as (\w+) from '\.\/(\w+)'/const \1 = Me.imports.\2/g" \
			>"$${source_file}.tmp" && \
			mv "$${source_file}.tmp" "$${source_file}" ; \
	done
	@wait
	@echo "Done. ✔"
	@echo "[ℹ] Finished compiling extension. ✔"

# Rebuild, install, reconfigure local settings, restart shell, and listen to journalctl logs
debug: check_dependencies compile generate_pot install configure enable restart_shell listen

check_dependencies:
	@echo -n "[ℹ] Checking dependencies... "
	@if ! command -v tsc >/dev/null; then \
		echo "[❌] Failed!" \
		echo '[ℹ] You must install TypeScript >= 3.8 to transpile (npm install typescript [-g]).'; \
		exit 1; \
	fi
	@echo "Done. ✔"

enable:
	@echo -n "[ℹ] Enabling extension $(EXT_UUID) ... "
	@gnome-extensions enable $(EXT_UUID)
	@echo "Done. ✔"

disable:
	@echo -n "[ℹ] Disabling extension $(EXT_UUID) ... "
	@gnome-extensions disable $(EXT_UUID)
	@echo "Done. ✔"

listen:
	@echo "[ℹ] Listening to journalctl logs..."
	@journalctl -o cat -n 0 -f "$$(which gnome-shell)" | grep -v warning

local_install: check_dependencies compile generate_pot install configure restart_shell enable

install: clean_build_folder
	@echo -n "[ℹ] Installing extension $(EXT_UUID) ... "
	@rm -rf $(INSTALL_BASE)/$(EXT_UUID)
	@mkdir -p $(INSTALL_BASE)/$(EXT_UUID)
	@cp -r $(BUILD_FOLDER)/* $(INSTALL_BASE)/$(EXT_UUID)/
	@echo "Done. ✔"

uninstall:
	@echo -n "[ℹ] Uninstalling extension $(EXT_UUID) ... "
	@rm -rf $(INSTALL_BASE)/$(EXT_UUID)
	@echo "Done. ✔"

restart_shell:
	@echo -n "[ℹ] Restarting GNOME Shell... "
	@if bash -c 'xprop -root &> /dev/null'; then \
		pkill -HUP gnome-shell; \
	else \
		gnome-session-quit --logout; \
	fi
	@sleep 3
	@echo "Done. ✔"

update_repository:
	@echo -n "[ℹ] Updating repository $(EXT_GIT_REPO_URL) ... "
	@git fetch origin
	@git reset --hard origin/master
	@git clean -fd
	@echo "Done. ✔"

zip: all
	@echo -n "[ℹ] Creating $(EXT_UUID)_$(EXT_VERSION).zip file ... "
	@mkdir -p $(DIST_FOLDER)
	@cd $(BUILD_FOLDER) && zip -qr "$(DIST_FOLDER)/$(EXT_UUID)_$(EXT_VERSION).zip" .
	@echo "Done. ✔"
