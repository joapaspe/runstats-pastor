from flask import Flask
from flask import jsonify
from backend import race_info, histograms
from utils.decorators import crossdomain
import json

app = Flask(__name__)
app.debug = True

@app.route('/')
@crossdomain(origin='*')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello World'

# The web services

# Main Services
@app.route('/circuits')
@crossdomain(origin='*')
def circuits():
  circuits = race_info.getCircuits()
  return jsonify(circuits)

#Circuit info
@app.route('/circuit_info/<circuit>')
@crossdomain(origin='*')
def circuitInfo(circuit):
  circuit_info = race_info.getCircuitInfo(circuit)
  return jsonify({'circuit':circuit_info})

#Races
@app.route('/all_races')
@crossdomain(origin='*')
def allRaces():
  races = race_info.getAllRaces()
  app.logger.debug('%s', races)

  return jsonify({'races':races})

@app.route('/all_circuit_races')
@crossdomain(origin='*')
def allCircuitRaces():
  races = race_info.getAllCircuitRaces()

  return jsonify(races)


@app.route('/histogram/<circuit>/<race_id>')
@crossdomain(origin='*')
def histogram(circuit, race_id):

  info = race_info.getRaceInfo(circuit, race_id)

  hist = histograms.getRaceHistogram(info)

  return jsonify({'histogram':hist})

if __name__ == '__main__':
  app.run('0.0.0.0')
