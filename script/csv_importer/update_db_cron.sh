#!/usr/bin/env bash
echo "START"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -n "$1" ]; then
    answer="$1"
else
    read -p "Want to install virtual env named 'venv' in this project ? (y/n) " answer
fi

VENV_DIR="$SCRIPT_DIR/venv"
export VENV_DIR
if [ "$answer" = "y" ]; then
  echo "Installing virtual env..."
    if ! [ -d "$VENV_DIR" ]; then
        python3 -m venv $VENV_DIR
    fi

    . $VENV_DIR/bin/activate
    echo "Installing requirements..."
    pip install -r requirements.txt
    pip install pymysql
    deactivate
else
  echo "Installation of virtual env 'venv' aborted!";
fi

echo "Virtual environment: activate"
. $VENV_DIR/bin/activate
echo "Virtual environment: activated"
echo "Start uploading data"
python3 $SCRIPT_DIR/main.py
echo "Finish uploading data"
echo "Virtual environment: deactivate"
deactivate
echo "Virtual environment: deactivated"
echo "END"