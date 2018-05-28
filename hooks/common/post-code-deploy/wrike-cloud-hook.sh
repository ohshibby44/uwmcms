#!/bin/bash
#
# Cloud Hook: post-code-deploy
# For more on Wrike projects, see
# https://developers.wrike.com/documentation/api/methods/create-task
#
#
# Github GraphQL docs:
# https://developer.github.com/v4/guides/forming-calls/
#
#
# Acquia Cloud hooks documentation:
#   https://github.com/acquia/cloud-hooks
#
# Acquia sample hook call:
#   Started
#   Updating s1.dev to deploy master
#   Deploying master on s1.dev
#   [05:28:33] Starting hook: post-code-deploy
#   Executing: /var/www/html/s1.dev/hooks/dev/post-code-deploy/hello-world.sh s1 dev master master s1@svn-3.bjaspan.hosting.acquia.com:s1.git git (as s1@srv-4)
#   Hello, Cloud!
#   [05:28:34] Finished hook: post-code-deploy
#
#

set +ev

site="$1"
target_env="$2"
source_branch="$3"
deployed_tag="$4"
repo_url="$5"
repo_type="$6"

github_token="fca59baef56daa4dc9e6069ffe1c2558b051ff24"

wrike_client_id="saDHmzPz"
wrike_account_api_token="2URYEzRHqgFtEnYeJvk9faKInRLktJs3yFuHobjGkWqoMgUJc8F46tqTUUpcFNqc-N-WFIUKC"
wrike_account_task_folder_id="IEABOA5QI4HA3PRF"


# Successful deploy.
if [ "$source_branch" != "$deployed_tag" ]; then


      github_branch=$(echo $deployed_tag | sed "s|-build||g")

      summary_text="UWM-CMS: A deployment has been made to *$site.$target_env* using tag *$deployed_tag* and source *$source_branch*"

      echo $summary_text
      
      body_text="<p><b><em>$summary_text</em></b></p><p>More can be found viewing our"
      body_text="$body_text <a href=\"https://github.com/uwmweb/uwmcms\">Github repo</a> or by browsing "
      body_text="$body_text <a href=\"https://github.com/uwmweb/uwmcms/commits/$github_branch\">this tag</a>.</p><br><br>"

      echo $body_text

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

      echo $github_query

      github_response=$(curl -H "Authorization: bearer $github_token" -d @- https://api.github.com/graphql <<EOF
      {
          "query": "query { $github_query }"
      }
EOF
)

      echo $github_response

      github_log=$(echo $github_response | tr -d '\n' | tr -d '\r' | ruby -e " \
      require 'rubygems'; require 'json'; require 'date'; d = JSON[STDIN.read]; \
      d['data']['repository']['object']['history']['edges'].each do |cmt| \
        puts '<p><b>—— ' + cmt['node']['abbreviatedOid'] + ' ' + \
          Date.parse(cmt['node']['committedDate']).strftime('%a, %d %b %Y') + '...</b> ' + \
          cmt['node']['message'] + '<br></p>'; \
        end;")

      $github_log="<code><b>COMMIT NOTES:</b><br><br>$github_log</code>"

      echo $github_log


      curl -g -X POST -H "Authorization: bearer $wrike_account_api_token" \
            --data "title=$summary_text" \
            --data-binary "description=$body_text<br>$github_log" \
            "https://www.wrike.com/api/v3/folders/$wrike_account_task_folder_id/tasks"


fi

