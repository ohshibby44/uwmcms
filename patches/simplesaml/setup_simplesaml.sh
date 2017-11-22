#!/usr/bin/env bash

set -e

echo "UWM-CMS: Seeting up vendor SimpleSAMLphp, default and host configurations."


#
# Copy default SimpleSAMLphp configuration files.
#
SIMPSAML=vendor/simplesamlphp/simplesamlphp
if [ ! -d $SIMPSAML ]; then
    SIMPSAML=../../vendor/simplesamlphp/simplesamlphp
fi

cp -rf $SIMPSAML/config-templates/* $SIMPSAML/config/
cp -rf $SIMPSAML/metadata-templates/* $SIMPSAML/metadata/


#
# Apply patch to add UWMCMS configuration.
#
PATCHES=patches/simplesaml
if [ ! -d $PATCHES ]; then
    PATCHES=../simplesaml
fi


patch -i $patches/simplesamlphp_config.patch
patch -i $patches/simplesamlphp_metadata.patch

set +v
