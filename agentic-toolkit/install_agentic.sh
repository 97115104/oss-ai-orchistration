#!/usr/bin/env bash
set -euo pipefail

MODEL=openai_gpt-oss-20b-coder-neo-code-di-matrix
UDID=$(uuidgen)

# Check if lms is installed
if ! command -v lms &> /dev/null; then
    printf "lms command not found. Please install lms-cli before running this script."
    exit 1
else
    clear
    printf "lms command found. Proceeding with installation...\n\n"
    printf "Unloading existing models for now...\n"
    lms unload --all
fi

# Check that the model string is not empty
if [ -z "$MODEL" ]; then
    printf "Error: MODEL variable is empty. Please specify a valid model.\n\n"
    exit 1
else
    printf "Model specified: $MODEL\nUDID: $UDID\n"
fi 

# load the specified model
lms load ${MODEL} --identifier="${UDID}"

# check that model loaded successfully
if [ $? -ne 0 ]; then
    printf "Error: Failed to load model ${MODEL}.\n\n"
    exit 1
else
   if lms ps | grep -q "${UDID}"; then
        printf "Model ${MODEL} loaded successfully with UDID: ${UDID}\n\n"
    else
        printf "Error: Model ${MODEL} not found in loaded models after loading.\n\n"
        exit 1
    fi
fi

printf "Installation complete. You can now use the model with UDID: ${UDID}\n"
lms chat "${UDID}"