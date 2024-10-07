#!/bin/bash
set -e


AZURE_FUNCTION_NAME=`basename $(pwd)`
AZURE_FUNCTION_PLAN=${AZURE_RESOURCE_GROUP}-plan

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


AZURE_VNET="nkdev-break-tryggvil-aks-vnet"
AZURE_VNET_SUBNET="function"

yarn build

az functionapp plan create --sku S1 --name ${AZURE_FUNCTION_PLAN} --resource-group ${AZURE_RESOURCE_GROUP}

az functionapp create --resource-group ${AZURE_RESOURCE_GROUP} --name ${AZURE_FUNCTION_NAME} --plan ${AZURE_FUNCTION_PLAN} --storage-account ${AZURE_STORAGE_ACCOUNT_NAME} --vnet ${AZURE_VNET} --subnet ${AZURE_VNET_SUBNET} --runtime node

#func azure functionapp publish ${AZURE_FUNCTION_NAME} --publish-local-settings --overwrite-settings --nozip
#az functionapp config appsettings set -n $functionAppName -g $resourceGroup --settings "MySetting1=Hello" "MySetting2=World"
#az functionapp update -g $resourceGroup -n $functionAppName --set dailyMemoryTimeQuota=50000

func azure functionapp publish ${AZURE_FUNCTION_NAME}
