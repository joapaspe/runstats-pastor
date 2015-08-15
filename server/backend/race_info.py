'''
Created on Aug 2, 2013

@author: jpastor
'''

import json

MAX_TIME = 1e6

# LOADING THE DATA
config = json.load(open("config.json"))
data_folder = config["data_folder"]

print "# Loading data", data_folder

# Loading races
races_file = "%s/races.json" % data_folder
f_races = open(races_file)
races_list = json.load(f_races)
f_races.close()
races = {}

for race in races_list:
    race_file = "%s/races/%s.json" % (data_folder, race)
    f_race = open(race_file)
    race_info = json.load(f_race)
    f_race.close()

    races[race] = race_info

# Circuit file
circuits_file = "%s/circuits.json" % data_folder
f_circuits = open(circuits_file)
circuits_list = json.load(f_circuits)
f_circuits.close()

# Populating circuits
circuits = {}
print circuits_list
for circuit in circuits_list:
    circuit_file = "%s/circuits/%s.json" % (data_folder, circuit)
    f_circuit = open(circuit_file)
    circuit_info = json.load(f_circuit)
    new_races = {}
    # Copying race info
    for race in circuit_info["races"]:
        new_races[race] = races[race]
    circuit_info["races"] = new_races
    f_circuit.close()

    circuits[circuit] = circuit_info
print json.dumps(races, sort_keys=True, indent=4)
print json.dumps(circuits, sort_keys=True, indent=4)


''' Receives a race_info object and compute the average pace
    Returns a tuple
'''
def getRacePaces(race_info, real=True):
    real_best = 999999
    real_avg  = 0
    oficial_best = 999999
    oficial_avg = 0

    for key in race_info:
      racer = race_info[key]
      oficial_best = min(official_best, racer["tofficial"])
      oficial_avg += racer["tofficial"]
      if (real):
            real_best = min(oficial_best, racer["preal"])
            real_avg += racer["treal"]

    res = {"oficial_best": oficial_best, "oficial_avg": int(oficial_avg/len(race_info))}

    if real:
      res["real_best"] = real_best
      res["real_avg"] = int(real_avg/len(race_info))

    return res

def getRaceInfo(id):
    # FIXME: Try catch if the file fails
    # TODO:  Use global variable for data
    # TODO: Cache the data...

    race_info = races[id]

    if not race_info:
        return None

    # FIXME: Update races json files, removing "data/" from the data_file
    # file_name = "data/%s" % race_info["data_file"]
    file_name = "%s" % race_info["data_file"]

    f_json = open(file_name)

    race_info = json.load(f_json)

    return race_info

def getCircuits():
    # TODO: Catch!
    return [(k, circuits[k]["name"]) for k in circuits]

def getRacesFromCircuits(circuit):
    circuit_info = circuits[circuit]
    if not circuit_info:
        return None
    return [(k, circuit_info["races"][k]["name"]) for k in circuit_info["races"]]

def getAllRaces():
    # TODO: Cache
    return races

def getAllCircuitRaces():
  import copy
  #TODO: Catch!
  clean_circuits = copy.deepcopy(circuits)

  for name, circuit in clean_circuits.iteritems():
    for race in circuit["races"]:
      circuit["races"][race]["circuit"] = name
      circuit["races"][race]["id"] = race
      del circuit["races"][race]["data_file"]

  return clean_circuits

def getCircuitInfo(circuit):
  import copy
  #TODO: Catch!

  if circuit not in circuits:
    return None

  circuit_info = copy.deepcopy(circuits[circuit])

  for race in circuit_info["races"]:
    del circuit_info["races"][race]["data_file"]

  return circuit_info
