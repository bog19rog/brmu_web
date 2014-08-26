'''
Configuration file
'''
import time

permanent_db = "DB/romania.db"
temporary_db = "DB/romania_tmp.db"
feedback_db = "DB/feedback.db"
places_suffix = "_places"
places_beers_suffix = "_places_beers"
beers_list = "beers_list"
cities_list = "cities_list"
added_new_record_message = "Added new record. Please wait for it to be moderated !"
existing_record_message = "Record already exists !"
timestamp = time.strftime("%d-%m-%Y")+"_"+time.strftime("%H:%M:%S")