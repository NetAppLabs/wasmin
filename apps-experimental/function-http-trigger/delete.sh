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


AZURE_FUNCTION_NAME=`basename $(pwd)`

if [ -z "$AZURE_RESOURCE_GROUP" ] || [ -z "$AZURE_STORAGE_ACCOUNT_NAME" ] || [ -z "$AZURE_LOCATION" ]; then
    echo "ERROR: AZURE_RESOURCE_GROUP or AZURE_STORAGE_ACCOUNT_NAME or AZURE_LOCATION not set" 1>&2
    exit 1
else
    echo "---"
    echo "using AZURE_RESOURCE_GROUP=$AZURE_RESOURCE_GROUP"
    echo "using AZURE_STORAGE_ACCOUNT_NAME=$AZURE_STORAGE_ACCOUNT_NAME"
    echo "using AZURE_LOCATION=$AZURE_LOCATION"
    echo "using AZURE_FUNCTION_NAME=$AZURE_FUNCTION_NAME"
    echo "---"
fi


az functionapp delete --resource-group ${AZURE_RESOURCE_GROUP} --name ${AZURE_FUNCTION_NAME} 
