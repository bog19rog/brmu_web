import pickledb
import time
from database_operations import db_operations
import config
#generate some records
#load romania.db
db = db_operations(config.permanent_db)

f = open("orase_ro.txt", 'r')

#insert cities

for line in f:
	db.save_city(line.lower().strip())
	
f.close()