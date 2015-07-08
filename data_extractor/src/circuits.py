__author__ = 'jpastor'
from races import Cronochip
import json
import sys

def parse_circuit(indexes, id, name, dst_dir, parser=Cronochip):
    """
    :return: dumps the circuit data in the dst_dir
    """
    race = Cronochip()

    for tag in indexes:
        race_summary, race_info = race.parse_race(tag)

        race_file = "%s/runners/%s.json" % (dst_dir, tag)
        # 1.Save race_info
        f = open(race_file, "w")
        json.dump(race_info, f)
        f.cloase()

        race_summary["data_file"] = race_file

        # 2. Save race_info
        f = open(race_summary_file, "w")
        race_summary_file = "%s/race/%s.json" % (dst_dir, tag)
        json.dump(race_summary, f)
        f.close()

    # Save the info circuit
    circuit = {
        "name": name,
        "races": indexes
    }

    circuit_file = "%s/circuits/%s.json" % (dst_dir, tag)
    # 1.Save race_info
    f = open(circuit_file, "w")
    json.dump(circuit, f)
    f.close()


if __name__ == '__main__':

    findexes = sys.argv[1]
    id = sys.argv[2]
    name = sys.argv[3]
    dst_dir = sys.argv[4]

    tags = [line.replace("\n", "") for line in open(findexes)]

    parse_circuit(tags, id, name, dst_dir)