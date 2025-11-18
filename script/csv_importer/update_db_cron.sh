echo "START"
echo "Virtual environment: activate"
. venv/bin/activate
echo "Virtual environment: activated"
echo "Start uploading data"
python3 main.py
echo "Finish uploading data"
echo "Virtual environment: deactivate"
deactivate
echo "Virtual environment: deactivated"
echo "END"