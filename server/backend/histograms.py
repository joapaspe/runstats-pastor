'''
Created on Aug 1, 2013

@author: jpastor
'''


MAX_TIME = 1e6

def toyHistogram():

  return {"values":[50, 40, 30, 10], "labels":["a", "b", "c", "d", "e"]}

''' Recieves a dict object with the info race and returns and histogram '''
def getRaceHistogram(race_info, interval=120):

  start = MAX_TIME
  end   = 0


  for key in race_info:
    racer = race_info[key]
    start = min(start, racer["tofficial"])
    end   = max(end, racer["tofficial"])

    # Trim start
    start = int(start/interval)*interval
    end = int(end /interval)*interval
    hist = [0]*(int(end-start)/interval+1)


  for key in race_info:
    racer = race_info[key]
    oficial = int(racer["tofficial"])
    general = racer["pgeneral"]
    pos = (int(oficial-start)/interval)
    hist[pos] += 1

    import datetime
    str(datetime.timedelta(seconds=666))

  time_stamps = [start+(i * interval) for i in range(int(end-start)/interval+1)]
  labels = [str(datetime.timedelta(seconds=stamp)) for stamp in time_stamps]


  return {"labels":labels,"values":hist, "time_stamps":time_stamps}

