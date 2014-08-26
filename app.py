#!/usr/bin/env python
import web
import pickledb
import json
import config
from database_operations import db_operations

urls = (
	'/', 'index',
    '/ro', 'page_ro',	
    '/en', 'page_en',
    '/cities', 'get_cities',
    '/beers', 'get_beers',
    '/beers_for_place', 'get_beers_for_place',
    '/places', 'get_places',
    '/search', 'search_places_beers',
    '/add', 'save_entry',
    '/get_address', 'retrieve_address'    
)

class index:
	def __init__(self):
		self.render = web.template.render('templates/')

	def GET(self, name=None):
		return self.render.index()

class page_en:
	def __init__(self):
		self.render = web.template.render('templates/')

	def GET(self, name=None):
		return self.render.index_en()

class page_ro:
	def __init__(self):
		self.render = web.template.render('templates/')

	def GET(self, name=None):
		return self.render.index_ro()

class get_cities:
	def GET(self):
		db = db_operations(config.permanent_db)
		web.header('Content-Type', 'application/json')
		return json.dumps(db.sort_list_by_searches(config.cities_list))

class retrieve_address:
	def GET(self):
		db = db_operations(config.permanent_db)
		get_input = web.input(_method='get')
		city_name, place_name = get_input.data.split("_")
		try:
			return db.get_place_address(city_name+config.places_suffix, place_name)
		except:
			return "Not Found !"

class get_beers:
	def GET(self):
		db = db_operations(config.permanent_db)
		web.header('Content-Type', 'application/json')
		return json.dumps(db.sort_list_by_searches(config.beers_list))

class get_places:
	def GET(self):
		db = db_operations(config.permanent_db)
		get_input = web.input(_method='get')
		response = []
		try:
			response = db.sort_list_by_searches(get_input.data+config.places_suffix)
			web.header('Content-Type', 'application/json')
			return json.dumps(response)
		except:
			return response

class get_beers_for_place:
	def GET(self):
		db = db_operations(config.permanent_db)
		#get_input = web.input(_method='get')
		city_name = web.input(_method='get')['c_name']
		place_name = web.input(_method='get')['p_name']
		response = []
		try:
			keys_list = db.get_all_keys_from_root_dict(city_name+config.places_beers_suffix)
			for key in keys_list:
				keys_list_array = key.split("-")
				if keys_list_array[0] == place_name:
					response.append(keys_list_array[1])
			web.header('Content-Type', 'application/json')
			return json.dumps(response)
		except:
			return "Not Found !"

class search_places_beers:
	def GET(self):
		db = db_operations(config.permanent_db)

		city_name = web.input(_method='get')['c_name']
		place_name = web.input(_method='get')['p_name']
		beer_name = web.input(_method='get')['b_name']
		beer_type = web.input(_method='get')['b_type']

		response = []

		if place_name != "Select a place" and beer_name != "Select a beer":
			response = db.search_by_place_beer(city_name, place_name, beer_name, beer_type)
			if len(response) > 0:
				web.header('Content-Type', 'application/json')
				return json.dumps(response)		
			else:
				return response

		if beer_name == "Select a beer":
			response = db.search_by_place(city_name, place_name, beer_type)
			if len(response) > 0:
				web.header('Content-Type', 'application/json')
				return json.dumps(response)
			else:
				return response

		if place_name == "Select a place":
			response = db.search_by_beer(city_name, beer_name, beer_type)
			print response
			if len(response) > 0:
				web.header('Content-Type', 'application/json')
				return json.dumps(response)		
			else:
				return response

class save_entry:
	def POST(self):

		get_record = web.input(_method='post')
		record_array = get_record.data.split(";")

		try:
			db = db_operations(config.temporary_db)
			db.save_city_name_place_beer(record_array)
			return "Your new record was added. It will be moderated shortly!"
		except:
			return "Error!"

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()