#!/usr/bin/env bash

set -e

if [ "$UID" = "0" ]; then
  echo 'This should not be run as root'
  exit 101
fi

source ./env.sh

function compile_translations() {
  echo 'Compiling translations...'
  for po in "${LOCALE_FOLDER}"/*/LC_MESSAGES/*.po; do
    msgfmt -cv -o ${po%.po}.mo $po
  done
}

function compile_preferences() {
  if [ -d "${SCHEMAS_FOLDER}" ]; then
    echo 'Compiling preferences...'
    glib-compile-schemas --targetdir="${SCHEMAS_FOLDER}" "${SCHEMAS_FOLDER}"
  else
    echo 'No preferences to compile... Skipping'
  fi
}

function make_compile_resources() {
  compile_translations
  compile_preferences
}

function make_dev_symlink() {
  make_compile_resources

  echo "Creating symlink from src folder to ${LOCAL_INSTALL_FOLDER}..."
  ln -s "${SRC_FOLDER}" "${LOCAL_INSTALL_FOLDER}"

  echo 'Done'
}

function make_dev_unlink() {
  make_compile_resources

  if [[ -L "${LOCAL_INSTALL_FOLDER}" ]] && [[ "$(readlink "${LOCAL_INSTALL_FOLDER}")" = "${SRC_FOLDER}" ]]; then
    echo "Removing symlink from dev folder to ${LOCAL_INSTALL_FOLDER}..."
    rm "${LOCAL_INSTALL_FOLDER}"
    echo 'Done'
  else
    echo "No symlink matches from current dev folder to ${LOCAL_INSTALL_FOLDER} found... Skipping"
  fi
}

function make_local_install() {
  make_compile_resources

  echo 'Installing...'
  if [ ! -d "${LOCAL_INSTALL_FOLDER}" ]; then
    mkdir "${LOCAL_INSTALL_FOLDER}"
  fi
  cp -r "${SRC_FOLDER}/*" "${LOCAL_INSTALL_FOLDER}"/
  rm "${LOCAL_INSTALL_FOLDER}"/typedefs.js
  rm "${LOCAL_INSTALL_FOLDER}"/schemas/*.xml
  rm "${LOCAL_INSTALL_FOLDER}"/locale/*.pot
  rm "${LOCAL_INSTALL_FOLDER}"/locale/LINGUAS
  rm -f "${LOCAL_INSTALL_FOLDER}"/locale/*/LC_MESSAGES/*.po

  echo 'Done'
}

function build_zip() {
  if [ -d ${BUILD_TMP_FOLDER} ]; then
    rm -r ${BUILD_TMP_FOLDER}
  fi
  mkdir -p ${BUILD_TMP_FOLDER}

  make_compile_resources

  echo 'Coping files...'
  cp -r LICENSE README.md "${SRC_FOLDER}/*" ${BUILD_TMP_FOLDER}/
  # https://gjs.guide/extensions/review-guidelines/review-guidelines.html#don-t-include-unnecessary-files
  rm "${BUILD_TMP_FOLDER}"/typedefs.js
  rm "${BUILD_TMP_FOLDER}"/schemas/*.xml
  rm "${BUILD_TMP_FOLDER}"/locale/*.pot
  rm "${BUILD_TMP_FOLDER}"/locale/LINGUAS
  rm -f "${BUILD_TMP_FOLDER}"/locale/*/LC_MESSAGES/*.po
  echo 'Creating archive..'
  cd ${BUILD_TMP_FOLDER}
  zip -r ../"$EXTENSION_UUID".zip ./*
  cd ../..
  rm -r ${BUILD_TMP_FOLDER}
  rm "${LOCALE_FOLDER}"/*/LC_MESSAGES/*.mo
  echo 'Done'
}

function usage() {
  echo 'Usage: ./install.sh COMMAND'
  echo 'COMMAND:'
  echo "  dev-compile    Compile schemas and translations into the current directory: ${DEV_FOLDER}"
  echo "  dev-symlink    Symlink current dev folder to the extension in the user's home directory: ${LOCAL_INSTALL_FOLDER}"
  echo "  dev-unlink     Remove symlink from current dev folder to the extension in the user's home directory: ${LOCAL_INSTALL_FOLDER}"
  echo "  local-install  install the extension in the user's home directory: ${LOCAL_INSTALL_FOLDER}"
  echo '  zip            Creates a zip file of the extension'
}

case "$1" in
"dev-compile")
  make_compile_resources
  ;;

"dev-symlink")
  make_dev_symlink
  ;;

"dev-unlink")
  make_dev_unlink
  ;;

"local-install")
  make_local_install
  ;;

"zip")
  build_zip
  ;;

*)
  usage
  ;;
esac
exit
