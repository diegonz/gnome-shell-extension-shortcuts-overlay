#!/usr/bin/env bash

set -e

if [ "$UID" = "0" ]; then
  echo 'This should not be run as root'
  exit 101
fi

AUTHOR="Diego González"
AUTHOR_EMAIL="diegonz@github.io"
AUTHOR_TEXT="${AUTHOR} <${AUTHOR_EMAIL}>"

CURRENT_DATE=$(date +"%Y-%m-%d %H:%M:%S%z")
CURRENT_YEAR=$(date +"%Y")

DEV_FOLDER="${PWD}"
SRC_FOLDER="${DEV_FOLDER}/src"
LOCALE_FOLDER="${SRC_FOLDER}/locale"
SCHEMAS_FOLDER="${SRC_FOLDER}/schemas"
BUILD_FOLDER="${PWD}/build"
BUILD_TMP_FOLDER="${BUILD_FOLDER}/tmp"

METADATA_FILE="${SRC_FOLDER}/metadata.json"
EXTENSION_UUID=$(grep uuid "${METADATA_FILE}" | cut -d"\"" -f4)
EXTENSION_VERSION="$(grep "\"version\"" "${METADATA_FILE}" | cut -d":" -f2)"
EXTENSION_GETTEXT_DOMAIN="$(grep gettext-domain "${METADATA_FILE}" | cut -d"\"" -f4)"
EXTENSION_NAME=$(grep name "${METADATA_FILE}" | cut -d"\"" -f4)
EXTENSION_DESCRIPTION=$(grep description "${METADATA_FILE}" | cut -d"\"" -f4)

POT_FILENAME="${EXTENSION_GETTEXT_DOMAIN}.pot"
LOCAL_INSTALL_FOLDER="${HOME}/.local/share/gnome-shell/extensions/${EXTENSION_UUID}"
