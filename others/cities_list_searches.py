import pickledb

db = pickledb.load("DB/romania.db", False)

all_dicts_from_cities_list = db.dget("root", "cities_list")
all_keys_from_cities_list = db.dget("root", "cities_list").keys()
print all_keys_from_cities_list
all_dicts_from_cities_list['turda']['searches'] += 1
db.dump()
print all_dicts_from_cities_list['turda']['searches']