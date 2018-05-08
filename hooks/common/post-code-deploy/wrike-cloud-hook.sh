#!/bin/bash
#
# Cloud Hook: post-code-deploy
# For more on Wrike projects, see
# https://developers.wrike.com/documentation/api/methods/create-task
#
# Docs at:
#   https://github.com/acquia/cloud-hooks
# Sample:
#   Started
#   Updating s1.dev to deploy master
#   Deploying master on s1.dev
#   [05:28:33] Starting hook: post-code-deploy
#   Executing: /var/www/html/s1.dev/hooks/dev/post-code-deploy/hello-world.sh s1 dev master master s1@svn-3.bjaspan.hosting.acquia.com:s1.git git (as s1@srv-4)
#   Hello, Cloud!
#   [05:28:34] Finished hook: post-code-deploy
#
#

set -ev

site="$1"
target_env="$2"
source_branch="$3"
deployed_tag="$4"
repo_url="$5"
repo_type="$6"

wrike_client_id="saDHmzPz"
wrike_account_api_token="2URYEzRHqgFtEnYeJvk9faKInRLktJs3yFuHobjGkWqoMgUJc8F46tqTUUpcFNqc-N-WFIUKC"
wrike_account_task_folder_id="IEABOA5QI4HA3PRF"


# Successful deploy.
if [ "$source_branch" != "$deployed_tag" ]; then

      summary_text="UWM-CMS: A deployment has been made to *$site.$target_env* using tag *$deployed_tag* and source *$source_branch*"

      git_log=`git log --pretty="<b>%h...%d:</b> %s %b" --max-count=40 --tags=$deployed_tag`

      body_text=`echo -e "<em>$summary_text</em> \n\n\n<code>$git_log</code>\n\nAlso see $repo_url. . . ." | sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/<br>/g'`

      curl -g -X POST -H "Authorization: bearer $wrike_account_api_token" \
            --data "title=$summary_text" \
            --data-binary "description=$body_text" \
            "https://www.wrike.com/api/v3/folders/$wrike_account_task_folder_id/tasks"


fi