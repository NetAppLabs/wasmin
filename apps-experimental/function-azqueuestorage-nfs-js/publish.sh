#!/bin/bash
# Copyright 2025 NetApp Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

set -e

if ! command -v jq 2>&1 ; then
    echo "please install jq"
    exit 1
fi
if ! command -v az 2>&1 ; then
    echo "please install az"
    exit 1
fi
if ! command -v func 2>&1 ; then
    echo "please install func"
    exit 1
fi


AZURE_FUNCTION_NAME=`basename $(pwd)`
AZURE_FUNCTION_PLAN=${AZURE_RESOURCE_GROUP}-plan-linux

if [ -z "$AZURE_RESOURCE_GROUP" ] || [ -z "$AZURE_STORAGE_ACCOUNT_NAME" ] || [ -z "$AZURE_LOCATION" ]; then
    echo "ERROR: AZURE_RESOURCE_GROUP or AZURE_STORAGE_ACCOUNT_NAME or AZURE_LOCATION not set" 1>&2
    exit 1
else
    echo "---"
    echo "using AZURE_RESOURCE_GROUP=$AZURE_RESOURCE_GROUP"
    echo "using AZURE_STORAGE_ACCOUNT_NAME=$AZURE_STORAGE_ACCOUNT_NAME"
    echo "using AZURE_LOCATION=$AZURE_LOCATION"
    echo "using AZURE_FUNCTION_NAME=$AZURE_FUNCTION_NAME"
    echo "using AZURE_FUNCTION_PLAN=$AZURE_FUNCTION_PLAN"
    echo "---"
fi

AZURE_VNET="nkdev-break-tryggvil-aks-vnet"
AZURE_VNET_SUBNET="function"

#yarn build

NODE_VERSION=$(cat local.settings.json | jq -r .Values.WEBSITE_NODE_DEFAULT_VERSION)
# Temporarily remove AzureWebJobsStorage from local.settings.json because in Azure cloud we do not want to override that setting
LOCAL_SETTINGS_BAK="local.settings.json.bak.${RANDOM}"
mv local.settings.json ${LOCAL_SETTINGS_BAK}
cat ${LOCAL_SETTINGS_BAK} | jq 'del(. | .Values.AzureWebJobsStorage)' > local.settings.json

az functionapp plan create --sku S1 --name ${AZURE_FUNCTION_PLAN} --resource-group ${AZURE_RESOURCE_GROUP} --is-linux true

az functionapp create --resource-group ${AZURE_RESOURCE_GROUP} --name ${AZURE_FUNCTION_NAME} --plan ${AZURE_FUNCTION_PLAN} --storage-account ${AZURE_STORAGE_ACCOUNT_NAME} --vnet ${AZURE_VNET} --subnet ${AZURE_VNET_SUBNET} --runtime node --os-type Linux

az functionapp update -g ${AZURE_RESOURCE_GROUP} -n ${AZURE_FUNCTION_NAME} --set dailyMemoryTimeQuota=50000

az functionapp config appsettings set -g ${AZURE_RESOURCE_GROUP} -n ${AZURE_FUNCTION_NAME} --settings FUNCTIONS_WORKER_RUNTIME=node FUNCTIONS_WORKER_PROCESS_COUNT=5 WEBSITE_NODE_DEFAULT_VERSION=22 languageWorkers__node__arguments="--experimental-wasm-jspi --experimental-wasm-type-reflection"

# For Linux we need to specifically set node version
az functionapp config set -g ${AZURE_RESOURCE_GROUP} -n ${AZURE_FUNCTION_NAME} --linux-fx-version "NODE|${NODE_VERSION}"

func azure functionapp publish ${AZURE_FUNCTION_NAME} --publish-local-settings  --overwrite-settings

#az functionapp config appsettings list -g ${AZURE_RESOURCE_GROUP} -n ${AZURE_FUNCTION_NAME}

# move back settings
mv -f ${LOCAL_SETTINGS_BAK} local.settings.json
