#
# Shell script aplies any patch.
#
# @example
# cd docroot && patches/drupal-htaccess/htaccess_patch.sh patches/drupal-htaccess/htaccess.patch
#
# @endexample
#
# @see https://github.com/acquia/blt/issues/1135#issuecomment-285404408
#
#

patch_file=$1

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

echo "UWM-CMS: Trying patches:"
echo "patch -p1 -N --dry-run --silent < $patch_file 2>/dev/null"


patch -p1 -N --dry-run --silent < $patch_file 2>/dev/null

# If the patch has not been applied then the $? which is the exit status
# for last command would have a success status code = 0

if [ $? -eq 0 ];
then

    echo "UWM-CMS: Okay patch return; applying patch:"
    echo "patch -p1 -N < $patch_file"

    patch -p1 -N < $patch_file

fi