from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from flask import jsonify
import argparse
import random
import time
import json
import threading

from pythonosc import osc_message_builder
from pythonosc import udp_client



def sendData():
	print("Hello! Dragon OSC Server is up.")
sendData()


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def test():
	if request.method == 'POST':
		parser = argparse.ArgumentParser()
		parser.add_argument("--ip", default="127.0.0.1",help="The ip of the OSC server")
		parser.add_argument("--port", type=int, default=8005,help="The port the OSC server is listening on")
		args = parser.parse_args()
		client = udp_client.SimpleUDPClient(args.ip, args.port)
		if request.json['play']:
			client.send_message("/cs/key/clearall", " ")
			client.send_message("/cs/playback/go", " ")
		elif request.json['preset']:
			client.send_message("/cs/playback/go", " ")
			client.send_message("/cs/playback/pause", " ")
			i = 1
			chanlist = request.json['chan']
			for chans in chanlist:
				client.send_message("/cs/key/clearselection", " ")
				for chan in chans:
					client.send_message("/cs/chan/add/" + str(chan), " ")
				client.send_message("/cs/chan/at/" + str(request.json['v'+str(i)]), " ")
				client.send_message("/cs/color/hs/" + str(request.json['h'+str(i)]) + "/" + str(request.json['s'+str(i)]), " ")
				i = i+1
		else:
			channelChange = "/cs/chan/select/" + request.json['chan']
			print("Changing channel selection to channel " + request.json['chan'])
			client.send_message(channelChange," ")
			print("Changing hsv to " + str(request.json['hue']) + ", " + str(request.json['sat']) + ", " + str(request.json['val']))
			level = "/cs/chan/at/" + str(request.json['val'])
			client.send_message(level," ")
			huesat = "/cs/color/hs/" + str(request.json['hue']) + "/" + str(request.json['sat'])
			client.send_message(huesat," ")
			client.send_message("/cs/playback/go", " ")
			client.send_message("/cs/playback/pause", " ")
		client.send_message("/cs/key/clearselection", " ")
		return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
	else:
		return('Complete')
if __name__== "__main__":
	app.run(host='0.0.0.0')