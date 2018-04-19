#!/bin/bash
#
# Cloud Hook: post-code-deploy
# For more on Wrike projects, see
# https://developers.wrike.com/documentation/api/methods/create-task
#
#
#
#

set -ev

site="$1"
target_env="$2"
source_branch="$3"
deployed_tag="$4"
repo_url="$5"
repo_type="$6"

wrike_account_api_token="11111111"
wrike_account_task_folder_name="11111111"

if [ $status -ne 0 ]; then

    # Failed deploy.

else
    # Successful deploy.
    if [ "$source_branch" != "$deployed_tag" ]; then

          message_text="An updated deployment has been made to *$site.$target_env* using tag *$deployed_tag*.\"

          curl -g -X POST -H "Authorization: bearer $wrike_account_api_token"
                -d "&title=Test task&status=Active" "https://www.wrike.com/api/v3/folders/$wrike_account_task_folder_name/tasks"

    else


    fi

fi