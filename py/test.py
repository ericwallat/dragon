import argparse
import math

from pythonosc import dispatcher
from pythonosc import osc_server

parser = argparse.ArgumentParser()
parser.add_argument("--ip", default="192.168.102.55",help="The ip of the OSC server")
parser.add_argument("--port", type=int, default=8006,help="The port the OSC server is listening on")
args = parser.parse_args()
dispatcher = dispatcher.Dispatcher()
dispatcher.map("*", print)
server = osc_server.ThreadingOSCUDPServer(
      (args.ip, args.port), dispatcher)

def print_volume_handler(unused_addr, args, volume):
  print("[{0}] ~ {1}".format(args[0], volume))

def print_compute_handler(unused_addr, args, volume):
  try:
    print("[{0}] ~ {1}".format(args[0], args[1](volume)))
  except ValueError: pass

if __name__== "__main__":
	app.run(host='0.0.0.0', port=6000)
	
app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def test():
  print(request.json)
