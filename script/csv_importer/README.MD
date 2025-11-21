- go to script/csv_importer
 cd ............
- create a new env called 'venv'
python3 -m venv venv

- activate the venv
windows
venv\Scripts\activate

unix
source venv/bin/activate

- modify file: config.py

- install the dependencies
pip install -r requirements.txt

if necessary:
pip install pymysql

run the code
sh update_db_cron.sh

or 
sh update_db_cron.sh
and install the venv in the batch 

in cron : sh update_db_cron.sh y
(abs path?)