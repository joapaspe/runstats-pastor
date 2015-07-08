__author__ = 'jpastor'


from abc import ABCMeta, abstractmethod
import urllib2
from BeautifulSoup import BeautifulSoup
import re
import sys
import datetime

class Race:
    __metaclass__ = ABCMeta

    @abstractmethod
    def parse_race(self):
        pass

    @classmethod
    def to_seconds(cls, x):
        d = datetime.datetime.strptime(x.strip(), "%H:%M:%S")
        return (d-datetime.datetime(1900, 1, 1)).total_seconds()

    @classmethod
    def my_str(cls, x):
        return str(x).strip()

    @classmethod
    def in_a(cls, tag, f):
        return f(tag.a.string)

class Cronochip(Race):
    def __init__(self):
        self.url = "http://www.cronochip.com/inscripciones/clasifications/general/page:%d/competition:%s"
        self.url_summary ="http://www.cronochip.com/inscripciones/clasifications/resumen/competition:%s"
        # TODO: move this to the abstract class

    def parse_race(self, tag):

        race_data = {
                "distance": 0,
                "name": "tag",
                "id": "tag",
                "teams": 0,
                "real_best": 0,
                "official_best": 0,
                "real_avg": 0,
                "official_avg": 0,
                "runners": 0
            }

        print "Parsing...", tag
        self.get_summary(tag, race_data)

        # Load the url
        no_end = True
        results = {}
        p = 1

        while no_end:
             url_page = self.url % (p, str(tag))
             no_end = self.parse_page(url_page, results)
             #no_end = False
             p += 1

        # results contains the player data
        # Compute the race data

        self.post_process_data(results, race_data)
        return race_data, results


    def get_summary(self, id, race_data):
        """

        :param id:
        :return:
        """

        url_page = self.url_summary % str(id)
        try:
            f = urllib2.urlopen(url_page)
            content = f.read()
            f.close()
        except:
            print >> sys.stderr, "Error Url not found", url_page
            return False

        parsed_html = BeautifulSoup(content)

        # Name
        race_data["name"]= parsed_html.h1.text

        # runners
        txt_runners = parsed_html.h2.text
        runners = int(re.search("participantes: (\d+)", txt_runners).groups()[0])
        race_data["runners"] = runners
        # Parsing: categories, sex

        categories = []
        end_cat = 0
        current_cat = 0
        sex = []
        for tr in parsed_html.table.findAll("tr"):
            if tr.th and end_cat < 2:
                end_cat += 1
                continue
            if tr.th and end_cat >= 2:
                current_cat += 1
                end_cat = 0
                continue

            if current_cat == 0:
                tds = tr.findAll("td")
                categories.append({"name": tds[2].text,
                                   "runners": int(tds[3].text)
                                   })
            elif current_cat == 1:
                tds = tr.findAll("td")
                sex.append({"name": tds[2].text,
                                   "runners": int(tds[3].text)
                                   })

        race_data["categories"] = categories
        race_data["sex"] = sex

        return True

    @classmethod
    def add_real_time(cls, race_info):
        """

        :param race_info:
        :return:
        """
        total = len(race_info)
        real_sorted = sorted(race_info, key = lambda x: race_info[x]["treal"])

        for p, runner in enumerate(real_sorted):
            race_info[runner]["preal"] = p+1

        return race_info

    def post_process_data(self, results, race_data):
        """

        :param results:
        :param race_data:
        :return:
        """
        #"teams": 0,
        # "real_best": 0,
        #           "oficial_best": 0,
        #           "real_avg": 0,
        #           "oficial_avg": 0,
        #            "runners": 0

        real_sorted = sorted(results, key = lambda x: results[x]["treal"])

        for p, runner in enumerate(real_sorted):
            results[runner]["preal"] = p + 1

        teams = {}

        real_best = 0
        real_avg = 0.0
        official_avg = 0.0

        total =  len(results)
        for r, runner in results.items():
            # Clubs
            if "club" in runner:
                club = runner["club"]
                if club not in teams:
                    teams[club] = 0
                teams[club] += 1

            if runner["preal"] == 1:
                real_best = runner["treal"]

            if runner["pgeneral"] == 1:
                official_best = runner["tofficial"]

            real_avg += runner["treal"]
            official_avg += runner["tofficial"]

        race_data["teams"] = teams
        race_data["real_avg"] = real_avg/total
        race_data["official_avg"] = official_avg/total
        race_data["official_best"] = official_best
        race_data["real_best"] = official_best




    def parse_page(self, url_page, results, race_info = None):
        """
        Scan one page fill the results
        :param url_page:
        :param results:
        :return:
        """
        try:
            f = urllib2.urlopen(url_page)
            content = f.read()
            f.close()
        except:
            print >> sys.stderr, "Error Url not found", url_page
            return False

        parsed_html = BeautifulSoup(content)
        # Check the page

        # Name of the race
        strinfo = parsed_html.table.td.text

        fin = True
        current, last = map(int, re.search("(\d+) de (\d+)", strinfo).groups())
        print >> sys.stderr, "# Name: %s (%d of %d)" % (strinfo, current, last)

        if current == last:
            fin = False
        t_results = parsed_html.findAll("table")[1]

        info_data = [
            ["pgeneral", int],
            ["pcat", int],
            ["cat", lambda x:self.in_a(x, self.my_str)],
            ["dorsal", int],
            None,
            ["tofficial", self.to_seconds],
            ["treal", self.to_seconds],
            ["club", lambda x:self.in_a(x, self.my_str)],
            None]

        for row in t_results.findAll("tr"):

            if not row.td:
                continue

            tds = row.findAll("td")
            d = {}

            for i, elem in enumerate(info_data):
                if elem:
                  value = tds[i].string
                  if not value:
                      value = tds[i]
                  d[elem[0]] = elem[1](value)
            dorsal = int(d["dorsal"])

            results[dorsal] = d
        return fin

if __name__ == '''__main__''':

    if len(sys.argv) < 1:
        exit(-1)

    id = sys.argv[1]

    race = Cronochip()

    race_info, runners_data = race.parse_race(id)

    print race_info

    print len(runners_data.items())