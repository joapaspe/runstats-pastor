# Quick installation
You should be able to extract and store the database in the *data* folder following the next instructions:

Extract data from *Divina Pastora 2014* and *Divina Pastora 2015*:

```
python circuits.py  --name="IX_Circuito_Divina_Pastora_Valencia" --id=divina2013 -d data/ --update
python circuits.py  --name="X_Circuito_Divina_Pastora_Valencia" --id=divina2014 -d data/ --update
```

Update the distances:

```
 python3 add_distance.py -f distances.txt
 ```

# Data Extractor
The data extractor is the module that connects to the web with the results,
parses and finally stores them.

Circuits are formed by several races, there are two ways of extract the data of the races belonging to a circuit:
-- provinding a file with the ids of the races you want to extract
-- add the "Cronochip" summary url.

## Data Structure
The data structure of the database follows the next structure:

    data/
    ├── circuits
    │   ├── divina2013.json
    │   └── divina2014.json
    ├── circuits.json
    ├── races
    │   ├── 429.json
    │   ├── ...
    │   └── 558.json
    ├── races.json
    └── runners
        ├── 429.json
        ...
        └── 558.json


- **circuit.json** contains a list of ids with the circuits.
- **circuits/** contains the file with the summary of each circuit.
- **races.json** a list from the ids of the races.
- **races/** summary of each race
- **runners** detailed data about the times and other data about the runners on each race.

## By circuit url
The `circuits.py` connects to web and extract the info.


Usage: circuits.py [options]

    Options:
      -h, --help            show this help message and exit
      -i INDEXES, --indexes=INDEXES
                            File with the ids of the race
      --id=ID               Id-key of the circuit
      --name=NAME           Name of the circuit. Real Name
      -d DST_DIR, --dst_dir=DST_DIR
                            Directory to set the file.
      --update              If the circuit exist reload it, the same with races
      --delete              Remove all the existing data


 
If an indexes file is not provided it connects to *Cronochip* and try to extract the 
data corresponding to the circuit.

### Extracting data from Divina pastora 2013
```
python circuits.py  --name="IX_Circuito_Divina_Pastora_Valencia" --id=divina2013 -d data/ --update
```

### Extracting data from Divina pastora 2014
```
python circuits.py  --name="X_Circuito_Divina_Pastora_Valencia" --id=divina2014 -d data/ --update
```

## Updating distances
When parsing *Cronochip* the distances are not provided.
For that there we provided a script for adding the distances to the races.
You can do interactively or use the *-f* options to provide a distances files.


    Usage: add_distance.py [options]
    
    Options:
      -h, --help            show this help message and exit
      -f FILE_DISTANCES     File with the ids of the race
      --update              Update data with value
      --save=FILE_SAVE      
      -d DATA_DIR, --data_dir=DATA_DIR
                            File with the ids of the race

Sample of usage:

```
 python3 add_distance.py -f distances.txt
```
 