__author__ = 'jpastor'
from races import Cronochip
import json
import sys
import os

def parse_circuit(indexes, id, name, dst_dir, parser=Cronochip,
                  update=False, delete=False
                  ):
    """
    :return: dumps the circuit data in the dst_dir
    """
    race = Cronochip()

    # Load or create the races files
    race_list_file = "%s/races.json" % (dst_dir)
    race_list = set()
    if not delete and os.path.exists(race_list_file):
        f = open(race_list_file)
        race_list = set(json.load(f))
        f.close()

    # Load circuit indexes
    circuit_list_file = "%s/circuits.json" % (dst_dir)
    circuit_list = set()
    if not delete and os.path.exists(circuit_list_file):
        f = open(circuit_list_file)
        circuit_list = set(json.load(f))

        f.close()

    if id in circuit_list:
        print >> sys.stderr, "The race %s already exists" % (id)
        if not update:
            return -1
        # Remove circuit

    for tag in indexes:
        if tag in race_list:
            print >> sys.stderr, "The race %s already exists" % (tag)
            if not update:
                continue
        race_summary, race_info = race.parse_race(tag)

        race_file = "%s/runners/%s.json" % (dst_dir, tag)
        # 1.Save race_info
        f = open(race_file, "w")
        json.dump(race_info, f)
        f.close()

        race_summary["data_file"] = race_file

        # 2. Save race_info
        race_summary_file = "%s/races/%s.json" % (dst_dir, tag)
        f = open(race_summary_file, "w")
        json.dump(race_summary, f)

        race_list.add(tag)
        f.close()

    # Save the info circuit
    circuit = {
        "name": name,
        "races": indexes
    }

    circuit_file = "%s/circuits/%s.json" % (dst_dir, id)
    # 1.Save race_info
    f = open(circuit_file, "w")
    json.dump(circuit, f)
    f.close()
    circuit_list.add(id)

    # Update the races
    f = open(race_list_file, "w")
    json.dump(list(race_list),f)
    f.close()

    # Update the circuits
    f = open(circuit_list_file, "w")
    json.dump(list(circuit_list),f)
    f.close()
from common import mkdir_p
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-i", "--indexes", dest="indexes",
                  help="File with the ids of the race")
parser.add_option("--id", dest="id",
                  help="Id-key of the circuit")
parser.add_option("--name", dest="name",
                  help="Name of the circuit. Real Name")
parser.add_option("-d", "--dst_dir", dest="dst_dir",
                  help="Directory to set the file.")
parser.add_option("--update", dest="update",
                  action="store_true",
                  help="If the circuit exist reload it, the same with races",
                  default=False)
parser.add_option("--delete", dest="delete",
                  action="store_true",
                  help="Remove all the existing data",
                  default=False)


(options, args) = parser.parse_args()


if __name__ == '__main__':

    findexes = options.indexes
    id = options.id
    name = options.name
    dst_dir = options.dst_dir

    tags = [line.replace("\n", "") for line in open(findexes)]

    for d in ["circuits", "races", "runners"]:
            mkdir_p(os.path.join(dst_dir,d))

    # Load circuit json

    parse_circuit(tags, id, name, dst_dir, update=options.update, delete=options.delete)