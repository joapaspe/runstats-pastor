
from runstats.backend import race_info 



circuits = race_info.circuits

import sys
import json
if __name__ == "__main__":
  import sys
  
  idCircuit = sys.argv[1]
  
  
  circuit = circuits[idCircuit]
  
  for race in circuit["races"]:
    
    race_dict = race_info.getRaceInfo(idCircuit, race)
    
    res = race_info.getRacePaces(race_dict)
    circuit["races"][race] = dict(circuit["races"][race].items()+res.items())
    
    
  json.dump(race_info.circuits, open("circuits.json","w"), indent=2)
  
  
