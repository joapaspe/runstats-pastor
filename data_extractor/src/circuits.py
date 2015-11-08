__author__ = 'jpastor'
from races import Cronochip, Sportmaniacs
import json
import sys
import os

import urllib2
from BeautifulSoup import BeautifulSoup
import re

def parse_circuit(indexes, id, name, dst_dir, platforms = [],
                  update=False, delete=False, dates = []
                  ):
    """
    :return: dumps the circuit data in the dst_dir
    """

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

    circuit_races = []
    if id in circuit_list:
        print >> sys.stderr, "The race %s already exists" % (id)
        if not update:
            circuit_file = "%s/circuits/%s.json" % (dst_dir, id)
            # 1.Save race_info
            f = open(circuit_file)
            circuit_info = json.load(f)
            circuit_races = circuit_info["races"]
            f.close()
            # Remove circuit

    for i, tag in enumerate(indexes):

        if platforms and platforms[i] == "sportmaniacs":
            race = Sportmaniacs()

        else:
            race = Cronochip()
        if tag in race_list:
            print >> sys.stderr, "The race %s already exists" % (tag)
            if not update:
                continue

        try:
            race_summary, race_info = race.parse_race(tag)
        except:
            print "Unexpected error:", sys.exc_info()[0]
            print "Problem parsing the race"
            continue

        race_file = "%s/runners/%s.json" % (dst_dir, tag)

        if dates:
            race_summary["date"] = dates[i]

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
        circuit_races.append(tag)
        f.close()

    # Save the info circuit
    circuit = {
        "name": name,
        "races": circuit_races
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


def get_indexes_from_cronochip(name):
    '''

    :param name:
    :return:
    '''
    url_page = "http://www.cronochip.com/%s.htm" % name.replace(" ","_")
    print "Loading from", url_page
    ids = []
    dates = []
    platforms = []
    try:
        f = urllib2.urlopen(url_page)
        content = f.read()
        f.close()
    except:
        print >> sys.stderr, "Error Url not found", url_page
        return False

    parsed_html = BeautifulSoup(content)

    for tr in parsed_html.table.findAll("tr"):
        if tr.th:
            continue
        tds = tr.findAll("td")

        if len(tds)< 3:
            continue

        name = tds[0].text
        date = tds[1].text
        race_url = tds[2].a["href"]

        #TODO Decide is sportmaniacs or cronochip
        try:
            id = re.search("(\d+)", race_url).groups()[0]
            platform = "cronochip"
        except:
            id = re.search("http://sportmaniacs.com/clasificacion/(\S+)", race_url).groups()[0]
            platform = "sportmaniacs"



        print name, date, id, platform
        ids.append(id)
        dates.append(date)
        platforms.append(platform)
    return ids, platforms, dates

from common import mkdir_p
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-i", "--indexes", dest="indexes",
                  help="File with the ids of the race")
parser.add_option("--id", dest="id",
                  help="Id-key of the circuit")
parser.add_option("--name", dest="name",
                  help="Name of the circuit. Real Name")
parser.add_option("-d", "--dst_dir", dest="dst_dir",default="data",
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

    for d in ["circuits", "races", "runners"]:
        mkdir_p(os.path.join(dst_dir,d))

    dates = []
    if not findexes:
        tags, platforms, dates = get_indexes_from_cronochip(name)

    else:
        tags = [line.replace("\n", "") for line in open(findexes)]
        # Load circuit json
    parse_circuit(tags, id, name, dst_dir,
                  update=options.update, delete=options.delete,
                  dates = dates, platforms=platforms)
