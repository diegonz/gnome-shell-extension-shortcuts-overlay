#!/usr/bin/env bash

set -e

if [ "$UID" = "0" ]; then
  echo 'This should not be run as root'
  exit 101
fi

source ./env.sh

xgettext \
  --package-name="${EXTENSION_UUID}" \
  --package-version="${EXTENSION_VERSION}" \
  --copyright-holder="${AUTHOR}" \
  --msgid-bugs-address="${AUTHOR_EMAIL}" \
  --add-comments=. \
  --sort-by-file \
  --no-wrap \
  --output="${LOCALE_FOLDER}/${POT_FILENAME}" \
  \
  "${SRC_FOLDER}/extension.js" \
  "${SRC_FOLDER}/prefs.js" \
  "${SRC_FOLDER}/preferences.ui" \
  "${SRC_FOLDER}/schemas/org.gnome.shell.extensions.shortcuts-overlay.gschema.xml"

sed -i "s/SOME DESCRIPTIVE TITLE/${EXTENSION_NAME}: ${EXTENSION_DESCRIPTION}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i "s/YEAR-MO-DA HO:MI+ZONE/${CURRENT_DATE}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i "s/YEAR/${CURRENT_YEAR}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i -E -e "s/<EMAIL@ADDRESS>|<LL@li.org>/<${AUTHOR_EMAIL}>/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i -E -e "s/FIRST AUTHOR|FULL NAME|LANGUAGE/${AUTHOR}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i "s/Language: /Language: en/" "${LOCALE_FOLDER}/${POT_FILENAME}"
