#!/usr/bin/env python
import web
import pickledb
import json
from database_operations import db_operations
import config

urls = (
    '/', 'moderate',
    '/get_dicts', 'get_records',
    '/save_record', 'save_entry',
    '/save_manual_place', 'save_place',
    '/save_manual_beer', 'save_beer',
    '/delete_record', 'delete_entry'
)

class moderate:

	def __init__(self):
		self.render = web.template.render('templates/')

	def GET(self, name=None):
		return self.render.moderate()

class get_records:
	def GET(self):
		db = db_operations(config.temporary_db)
		
		dicts = db.get_all_dicts_from_root()

		web.header('Content-Type', 'application/json')
		return json.dumps(dicts)		

class delete_entry:
	def POST(self):
		get_record = web.input(_method='post')

		record_array = get_record.data.split(";")

		db = db_operations(config.temporary_db)

		return db.delete_entry(record_array)

class save_entry:
	def POST(self):
		get_record = web.input(_method='post')

		db = db_operations(config.permanent_db)

		record_array = get_record.data.split(";")
		#print len(record_array)
		db.save_city_name_place_beer(record_array)

		return "done"

class save_place:
	def POST(self):
		get_record = web.input(_method='post')
		#print get_record
		
		record_array = get_record.data.split(";")

		place_name = record_array[1]
		datetime_added = record_array[3]

		city_name_array = record_array[0].split("_")

		city_name = city_name_array[0]
		place_name = record_array[1]		

		db = db_operations(config.permanent_db)

		db.save_city_name_place(city_name, place_name)

		return "done"

class save_beer:
	def POST(self):
		get_record = web.input(_method='post')
		#print get_record
		
		record_array = get_record.data.split(";")

		beer_name = record_array[0]
		datetime_added = record_array[2]

		db = db_operations(config.permanent_db)

		db.save_beer(beer_name)

		return "done"		

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()