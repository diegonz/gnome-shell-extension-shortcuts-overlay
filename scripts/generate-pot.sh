#!/usr/bin/env bash

set -e

if [ "$UID" = "0" ]; then
  echo 'This should not be run as root'
  exit 101
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source "${SCRIPT_DIR}"/env.sh

xgettext \
  --package-name="${EXTENSION_UUID}" \
  --package-version="${EXTENSION_VERSION}" \
  --copyright-holder="${AUTHOR}" \
  --msgid-bugs-address="${AUTHOR_EMAIL}" \
  --language=Javascript \
  --keyword=_ \
  --from-code=UTF-8 \
  --add-comments=. \
  --sort-by-file \
  --no-wrap \
  --output="${LOCALE_FOLDER}/${POT_FILENAME}" \
  \
  "${TARGET_FOLDER}/extension.js" \
  "${TARGET_FOLDER}/daemon.js" \
  "${TARGET_FOLDER}/overlay.js" \
  "${TARGET_FOLDER}/fileReader.js" \
  "${TARGET_FOLDER}/prefs.js"

xgettext \
  --package-name="${EXTENSION_UUID}" \
  --package-version="${EXTENSION_VERSION}" \
  --copyright-holder="${AUTHOR}" \
  --msgid-bugs-address="${AUTHOR_EMAIL}" \
  --add-comments=. \
  --sort-by-file \
  --no-wrap \
  --join-existing \
  --output="${LOCALE_FOLDER}/${POT_FILENAME}" \
  \
  "${SRC_FOLDER}/schemas/org.gnome.shell.extensions.shortcuts-overlay.gschema.xml"

sed -i "s/SOME DESCRIPTIVE TITLE/${EXTENSION_NAME}: ${EXTENSION_DESCRIPTION}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i "s/YEAR-MO-DA HO:MI+ZONE/${CURRENT_DATE}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i "s/YEAR/${CURRENT_YEAR}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i -E -e "s/<EMAIL@ADDRESS>|<LL@li.org>/<${AUTHOR_EMAIL}>/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i -E -e "s/FIRST AUTHOR|FULL NAME|LANGUAGE/${AUTHOR}/" "${LOCALE_FOLDER}/${POT_FILENAME}"
sed -i "s/Language: /Language: en/" "${LOCALE_FOLDER}/${POT_FILENAME}"
