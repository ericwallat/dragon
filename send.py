from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from flask import jsonify
import argparse
import random
import time
import json
import threading
import colorsys

from pythonosc import osc_message_builder
from pythonosc import udp_client



def sendData():
	print("Hello! Dragon OSC Server is up.")
sendData()


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def test():
	data = {1: "rgb(255,255,255)",2: "rgb(255,255,255)",3: "rgb(255,255,255)",4: "rgb(255,255,255)",
		5: "rgb(255,255,255)",6: "rgb(255,255,255)",7: "rgb(255,255,255)",8: "rgb(255,255,255)",
		9: "rgb(255,255,255)",10: "rgb(255,255,255)",11: "rgb(255,255,255)",12: "rgb(255,255,255)",
		13: "rgb(255,255,255)"}
	if request.method == 'POST':
		parser = argparse.ArgumentParser()
		parser.add_argument("--ip", default="ewallat7-32987",help="The ip of the OSC server")
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
					h = request.json['h'+str(i)]
					s = request.json['s'+str(i)]
					v = request.json['v'+str(i)]
					rgb = tuple(int(i * 255) for i in colorsys.hsv_to_rgb(h/360,s/100,v/100))
					data[chan] = "rgb" + str(rgb)
				client.send_message("/cs/chan/at/" + str(v), " ")
				client.send_message("/cs/color/hs/" + str(h) + "/" + str(s), " ")
				i = i+1
		else:
			channelChange = "/cs/chan/select/" + request.json['chan']
			print("Changing channel selection to channel " + request.json['chan'])
			client.send_message(channelChange," ")
			h = request.json['hue']
			s = request.json['sat']
			v = request.json['val']
			print("Changing hsv to " + str(h) + ", " + str(s) + ", " + str(v))
			level = "/cs/chan/at/" + str(v)
			client.send_message(level," ")
			huesat = "/cs/color/hs/" + str(h) + "/" + str(s)
			client.send_message(huesat," ")
			client.send_message("/cs/playback/go", " ")
			client.send_message("/cs/playback/pause", " ")
			with open('data.json', 'r') as jsonFile:
				data = json.load(jsonFile)
			rgb = tuple(int(i * 255) for i in colorsys.hsv_to_rgb(h/360,s/100,v/100))
			data[request.json['chan']] = "rgb" + str(rgb)
		client.send_message("/cs/key/clearselection", " ")
		with open('data.json', 'w') as outfile:
			json.dump(data, outfile)
		return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
	else:
		return('Complete')
if __name__== "__main__":
	app.run(host='0.0.0.0', port=8006)