#!/bin/sh
set -ex

# In goes standard JS. Out comes GJS-compatible JS
transpile() {
    _source="${1}"
    _destination="${2}"

    cat "${_source}" |
        sed -e 's#export function#function#g' \
            -e 's#export var#var#g' \
            -e 's#export const#var#g' \
            -e 's#Object.defineProperty(exports, "__esModule", { value: true });#var exports = {};#g' |
        sed -E 's/export class (\w+)/var \1 = class \1/g' |
        sed -E "s/import \* as (\w+) from '\.\.\/\@types\/\w+'/const \1 = imports.gi.\1/g" |
        sed -E "/import \{(\w+)\} from 'types'/d" |
        sed -E "s/import \{\s?(\w+)\s?\} from '(\w+)'/const \1 = Me.imports.\2.\1/g" |
        sed -E "s/import \* as (\w+) from '(\w+)'/const \1 = Me.imports.\2/g" \
            >"${_destination}"
}

rm -rf build

glib-compile-schemas --targetdir="${SCHEMAS_FOLDER}" "${SCHEMAS_FOLDER}"

# Transpile to JavaScript

mkdir -p "${BUILD_FOLDER}"

tsc

wait

# Convert JS to GJS-compatible scripts

cp -r "${METADATA_FILE}" "${SCHEMAS_FOLDER}" "${LOCALE_FOLDER}" "${SRC_FOLDER}"/*.css "${BUILD_FOLDER}" &

#find "${TARGET_FOLDER}" -type f -name '*.js' -exec sh -c 'transpile "{}" $(echo "{}" | sed s#target#build#g)' \;
for src in $(find "${TARGET_FOLDER}" -type f -name '*.js'); do
    dest=$(echo "${src}" | sed s#target#build#g)
    transpile "${src}" "${dest}"
done

wait
