'''
Created on Aug 12, 2013

@author: jpastor
'''

import race_info
import logging

def getRunnerCircuitInfo(circuit, runner):
    
    circuit_info = race_info.getCircuitInfo(circuit)
    
    if not circuit_info:
        return None
    
    races = []
    
    for race in circuit_info["races"]:
        race_obj = race_info.getRaceInfo(circuit, race)
        
        runner_info = {}
         
        if runner in race_obj:
            runner_info = race_obj[runner]
            logging.info(race)
            logging.info(runner_info)
            n_runners = circuit_info["races"][race]["runners"]
            distance  = circuit_info["races"][race]["distance"]/1000.0
            if "preal" in runner_info:
                runner_info["relative_real"] = float(runner_info["preal"])/n_runners
                runner_info["real_pace"] = runner_info["treal"]/distance
            runner_info["relative_general"] = float(runner_info["pgeneral"])/n_runners
            runner_info["oficial_pace"] = runner_info["toficial"]/distance
            
        runner_info["race"] = race
        races.append(runner_info)
    return sorted(races, key = lambda x: x["race"])
    #return races
        
        
    