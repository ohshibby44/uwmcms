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

github_token=5b07de54cee80e913411387a61e7c1a0c049846f
wrike_client_id="saDHmzPz"
wrike_account_api_token="2URYEzRHqgFtEnYeJvk9faKInRLktJs3yFuHobjGkWqoMgUJc8F46tqTUUpcFNqc-N-WFIUKC"
wrike_account_task_folder_id="IEABOA5QI4HA3PRF"


# Successful deploy.
if [ "$source_branch" != "$deployed_tag" ]; then


      github_branch=$(sed "s|-build||g" <<< $deployed_tag)

      summary_text="UWM-CMS: A deployment has been made to *$site.$target_env* using tag *$deployed_tag* and source *$source_branch*"
      
      body_text="<p>More can be found at: <br>"
      body_text+="<a href=\"https://github.com/uwmweb/uwmcms\">Github repo</a> or<br>"
      body_text+="<a href=\"https://github.com/uwmweb/uwmcms/commits/$github_branch\">https://github.com/uwmweb/uwmcms/commits/$github_branch</a></p>"


      github_query=$(cat <<EOF
      repository(owner: \"uwmweb\", name: \"uwmcms\") {
        object(expression: \"$github_branch\") {
          ... on Commit {
            history(first: 30) {
              edges {
                node {
                  abbreviatedOid
                  committedDate
                  message
                }
              }
            }
          }
        }
      }
EOF
)


      github_response=$(curl -H "Authorization: bearer $github_token" -d @- https://api.github.com/graphql <<EOF
      {
          "query": "query { $github_query }"
      }
EOF
)


      github_log=$(echo $github_response | tr -d '\n' | tr -d '\r' | ruby -e " \
      require 'rubygems'; require 'json'; require 'date'; s =''; d = JSON[STDIN.read]; \
      d['data']['repository']['object']['history']['edges'].each do |cmt| \
        puts '<p><b>' + cmt['node']['abbreviatedOid'] + '...</b>' + \
          Date.parse(cmt['node']['committedDate']).strftime('%a, %d %b %Y') + '...' + \
          cmt['node']['message'] + '</p>'; \
        end; puts s;")



      curl -g -X POST -H "Authorization: bearer $wrike_account_api_token" \
            --data "title=$summary_text" \
            --data-binary "description=$body_text<br><br><br><code>$github_log</code>" \
            "https://www.wrike.com/api/v3/folders/$wrike_account_task_folder_id/tasks"


fi