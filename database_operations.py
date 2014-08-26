import pickledb
import config
#from operator import itemgetter

class db_operations:
	def __init__(self, database_file):
		self.db = pickledb.load(database_file, False)

	def get_all_dicts_from_root(self):
		return self.db.dgetall("root")

	def get_all_keys_from_root_dict(self, dictionary):
		return self.db.dget("root", dictionary).keys()

	def get_all_dicts_from_root_dict(self, dictionary):
		return self.db.dget("root", dictionary)

	def sort_list_by_searches(self, bucket):
		bucket_keys_list = self.get_all_keys_from_root_dict(bucket)
		bucket_dicts = self.get_all_dicts_from_root_dict(bucket)
		name_searches_pairs_array = []
		for item in bucket_keys_list:
			name_searches_pairs_array.append([item, bucket_dicts[item]['searches']])

		sorted_pairs_list = sorted(name_searches_pairs_array, key=lambda tup: (-tup[1], tup[0]))
		sorted_names_by_searches_list = []
		for pair in sorted_pairs_list:
			sorted_names_by_searches_list.append(pair[0])

		return sorted_names_by_searches_list

	def increment_searches(self, bucket, entity):
		all_keys_from_bucket = self.db.dget("root", bucket)
		all_keys_from_bucket[entity]['searches'] += 1
		self.db.dump()

	def filter_results_by_beer_type(self, response, beer_type):
		if beer_type == "all":
			return response
		else:
			response_new = response
			#print len(response_new)
			for kss in response_new.keys():
				for beer_types in response_new[kss].keys():
					if beer_type not in beer_types:
						del(response_new[kss][beer_types])
			for kss in response_new.keys():
				if response_new[kss]:
					print "not empty!"
				else:
					#print "empty"
					del(response_new[kss])
			return response_new

	def search_by_place_beer(self, city_name, place_name, beer_name, beer_type):
		response = dict()
		try:
			response[place_name + "-" + beer_name] = self.get_all_dicts_from_root_dict(city_name+config.places_beers_suffix)[place_name + "-" + beer_name]
			self.increment_searches(config.cities_list, city_name)
			self.increment_searches(config.beers_list, beer_name)
			self.increment_searches(city_name+config.places_suffix, place_name)
			#self.filter_results_by_beer_type(response, beer_type)
			return self.filter_results_by_beer_type(response, beer_type)
		except:
			return response

	def search_by_place(self, city_name, place_name, beer_type):
		response = dict()
		try:
			all_keys_from_city_places_beers = self.get_all_keys_from_root_dict(city_name+config.places_beers_suffix)
			for key_pair in all_keys_from_city_places_beers:
				key_pair_array = key_pair.split("-")
				if key_pair_array[0] == place_name:
					response[key_pair_array[1]] = self.get_all_dicts_from_root_dict(city_name+config.places_beers_suffix)[key_pair]
			self.increment_searches(config.cities_list, city_name)
			self.increment_searches(city_name+config.places_suffix, place_name)
			#return response
			return self.filter_results_by_beer_type(response, beer_type)
		except:
			return response

	def search_by_beer(self, city_name, beer_name, beer_type):
		response = dict()
		try:
			all_keys_from_city_places_beers = self.get_all_keys_from_root_dict(city_name+config.places_beers_suffix)
			for key_pair in all_keys_from_city_places_beers:
				key_pair_array = key_pair.split("-")
				if beer_name in key_pair_array[1]:
					response[key_pair_array[0]] = self.get_all_dicts_from_root_dict(city_name+config.places_beers_suffix)[key_pair]
			self.increment_searches(config.cities_list, city_name)
			self.increment_searches(config.beers_list, beer_name)	
			return self.filter_results_by_beer_type(response, beer_type)
		except:
			return response

	def delete_entry(self, sequence_of_values):
		city_place_beer = sequence_of_values[0]
		place_beer = sequence_of_values[1]
		beer_type = sequence_of_values[2]

		all_keys_from_places_beers = self.db.dget("root", city_place_beer)
		#delete beer_type entry
		#print len(all_keys_from_places_beers[place_beer])
		del all_keys_from_places_beers[place_beer][beer_type]
		self.db.dump()
		#if dict is empty, delete it
		if len(all_keys_from_places_beers[place_beer]) == 0:
			del all_keys_from_places_beers[place_beer]
			self.db.dump()		

		return "done"

	def save_city(self, city_name):
		#try to get all keys from root
		try:
			all_keys_from_root = self.db.dgetall("root").keys()
		except:
			#create root dictionary
			self.db.dcreate("root")
			self.db.dump()	

		all_keys_from_root = self.db.dgetall("root").keys()

		if config.cities_list in all_keys_from_root:
			#print "cities_list exists. going deeper"
			all_dicts_from_cities_list = self.db.dget("root", config.cities_list)
			all_keys_from_cities_list = self.db.dget("root", config.cities_list).keys()

			#if city name exists
			if city_name in all_keys_from_cities_list:
				print "city exists. do nothing"
				print city_name
			else:
				#add city name
				#print "city didn't exist. added."
				all_dicts_from_cities_list.update( dict([[ city_name, dict([('searches', 0)]) ]]) )
				self.db.dump()					
		else:
			#add cities_list + city name
			self.db.dadd("root", ( config.cities_list,  dict([[ city_name, dict([('searches', 0)]) ]]) ) )
			#all_dicts_from_cities_list.update(dict([[ city_name, dict([('searches', 0)]) ]]))
			self.db.dump()			

	def save_beer(self, beer_name):
		all_keys_from_root = self.db.dgetall("root").keys()
		if config.beers_list in all_keys_from_root:
			#print "beer exists. do nothing"
			all_dicts_from_beers_list = self.db.dget("root", config.beers_list)
			all_keys_from_beers_list = self.db.dget("root", config.beers_list).keys()
			#if beer name exists
			if beer_name in all_keys_from_beers_list:
				print "beer exists. do nothing"
			else:
				#add beer name
				#print "beer didn't exist. added."
				all_dicts_from_beers_list.update( dict([[ beer_name, dict([('searches', 0)]) ]]) )
				self.db.dump()					
		else:
			#add beers_list + beer name
			self.db.dadd("root", (config.beers_list,  dict([[ beer_name, dict([('searches', 0)]) ]])  ))
			self.db.dump()			

	def save_city_name_place(self, city_name, place_name):
		all_keys_from_root = self.db.dgetall("root").keys()
		if city_name+"_places" in all_keys_from_root:
			all_keys_from_city_places = self.db.dget("root", city_name+"_places")
			#if place name exists
			if place_name in all_keys_from_city_places:
				print "place exists. do nothing"
			else:
				#add place name
				#print "place didn't exist. added."
				all_keys_from_city_places.update( dict([[place_name, dict( [('searches', 0)]) ]]) )
				self.db.dump()				
		else:
			#add city-name_places + place_name
			self.db.dadd("root", (city_name+"_places",  dict([[place_name, dict( [('searches', 0)]) ]])  ))
			self.db.dump()

	def save_city_name_place_beer(self, sequence_of_values):
		city_place_beer = sequence_of_values[0]
		place_beer = sequence_of_values[1]
		beer_type = sequence_of_values[2]
		beer_price = sequence_of_values[3]
		datetime_added = sequence_of_values[4]

		city_name_place_beer_array = sequence_of_values[0].split("_")
		place_beer_array = sequence_of_values[1].split("-")
		city_name = city_name_place_beer_array[0]
		place_name = place_beer_array[0]
		beer_name = place_beer_array[1]

		#try to get all keys from root
		try:
			print "ajuns aici 1"
			all_keys_from_root = self.db.dgetall("root").keys()
		except:
			print "ajuns aici 2"
			#create root dictionary
			self.db.dcreate("root")
			self.db.dump()	

		all_keys_from_root = self.db.dgetall("root").keys()
		#city-name_place_beer section -------------
		#add to existing dictionaries in self.db
		#verify if _places_beers dictionary exists in root
		if city_place_beer in all_keys_from_root:
			
			#if exists, get all keys from it
			all_dicts_from_places_beers = self.db.dget("root", city_place_beer)
			all_keys_from_places_beers = self.db.dget("root", city_place_beer).keys()
			#search for specific place-beer key
			w = False
			for rec in all_keys_from_places_beers:

				if place_beer == rec:
					w = True
					#get all beer_types		
					#print "place_beer exists"
					#if found, return beer types
					beer_types_array = all_dicts_from_places_beers[place_beer].keys()
					#print "beer types array"
					#print beer_types_array
					if beer_type in beer_types_array:
						#print "go deeper to the price"
						if all_dicts_from_places_beers[place_beer][beer_type]['price'] == beer_price:
							print "same price. do nothing"
						else:
							all_dicts_from_places_beers[place_beer][beer_type]['price'] = beer_price
							self.db.dump()
					else:
						#print "adding beer type"

						print "o intrat unde trebe"
						print all_dicts_from_places_beers[place_beer]
						all_dicts_from_places_beers[place_beer].update(dict([[ beer_type, dict( [('price', beer_price), ('datetime_added', datetime_added) ] )  ]]))						
						#all_dicts_from_places_beers[place_beer][beer_type].update(dict( [('price', beer_price), ('datetime_added', datetime_added) ] ))
						self.db.dump()
			#add place_beer_key+beer_type
			#else:
			#print "added place_beer_key+beer_type"
			if w == False:
				#self.db.dadd("root", (city_place_beer, dict([[place_beer, dict([[beer_type, dict([('price', beer_price),('datetime_added', datetime_added)])]]) ]]) ))
				print "aici nu trebe"
				all_dicts_from_places_beers.update( dict([[place_beer, dict([[beer_type, dict([('price', beer_price),('datetime_added', datetime_added)])]]) ]]) )
				self.db.dump()

		else:
			#print "fuck you !!"
			self.db.dadd("root", (city_place_beer, dict([[place_beer, dict([[beer_type, dict([('price', beer_price),('datetime_added', datetime_added)]) ]] ) ]]) ))
			self.db.dump()

		#city-name_places section ------------
		self.save_city_name_place(city_name, place_name)

		#beers_list section ---------------
		self.save_beer(beer_name)