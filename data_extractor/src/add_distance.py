#!/usr/bin/python3
__author__ = 'jpastor'
import json
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-f", dest="file_distances",
                  help="File with the ids of the race")
parser.add_option("--update", dest="update",
                  action="store_true",
                  help="Update data with value",
                  default=False)

parser.add_option("--save", dest="file_save")

parser.add_option("-d", "--data_dir", dest="data_dir", default="data",
                  help="File with the ids of the race")

(options, args) = parser.parse_args()

if __name__ == "__main__":

    # Open data dir

    file_races = "%s/races.json" % (options.data_dir)

    list_races_distances = []

    distances = {}
    races = []
    if options.file_distances:
        f_dist = open(options.file_distances)
        for line in f_dist:
            fields = line.split()
            id, new_dist = fields[0], int(fields[1])
            distances[id] = new_dist
            races.append(id)
    else:
        f_races = open(file_races)
        races = json.load(f_races)
        f_races.close()

    f_save = None
    if options.file_save:
        f_save = open(options.file_save, "w")

    for id_race in races:
        file_race = "%s/races/%s.json" % (options.data_dir,id_race)
        f_race = open(file_race)
        race_summary = json.load(f_race)
        if not "distance" in race_summary or race_summary["distance"] == 0 or options.update:
            if not distances:
                print("Distance of race id %s (%s) (meters):" % (id_race, race_summary["name"]))
                new_dist = int(input())
            else:
                new_dist = distances[id_race]

            print("Updating race %s with %d meters" % (id_race, new_dist))
            race_summary["distance"] = new_dist
            f_race.close()
            f_race = open(file_race, "w")
            json.dump(race_summary, f_race)

            if f_save:
                print(id_race, new_dist, race_summary["name"], file = f_save)
        f_race.close()
    if f_save:
        f_save.close()
