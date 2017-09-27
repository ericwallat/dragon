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
import datetime, calendar
from collections import deque

from pythonosc import osc_message_builder
from pythonosc import udp_client


lastClick = 0
log = ''
d=deque([], maxlen=5)
playing = False;
parser = argparse.ArgumentParser()
parser.add_argument("--ip", default="192.168.102.55",help="The ip of the OSC server")
parser.add_argument("--port", type=int, default=8005,help="The port the OSC server is listening on")
args = parser.parse_args()
client = udp_client.SimpleUDPClient(args.ip, args.port)
data = {'Eyes': "rgb(255,255,255)",'Head Right': "rgb(255,255,255)",'Head Left': "rgb(255,255,255)",'Front': "rgb(255,255,255)",
		'Back': "rgb(255,255,255)",'Scales': "rgb(255,255,255)",'Left Side': "rgb(255,255,255)",'Right Side': "rgb(255,255,255)"}

def sendData():
	print("Hello! Dragon OSC Server is up.")
sendData()


def checkclick():
	global lastClick, playing, data
	threading.Timer(2, checkclick).start()
	if lastClick <= 1000*calendar.timegm(time.gmtime()) - 60000 and not playing:
		client.send_message("/cs/key/clearall", " ")
		client.send_message("/cs/playback/go", " ")
		print("Playing cues...")
		playing = True
		data = {'Eyes': "rgb(255,255,255)",'Head Right': "rgb(255,255,255)",'Head Left': "rgb(255,255,255)",'Front': "rgb(255,255,255)",
		'Back': "rgb(255,255,255)",'Scales': "rgb(255,255,255)",'Left Side': "rgb(255,255,255)",'Right Side': "rgb(255,255,255)"}
		with open('json/data.json', 'w') as outfile:
			json.dump(data,outfile)
checkclick()

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def test():
	if request.method == 'POST':
		global playing, lastClick, data
		lastClick = request.json['last']
		if not request.json['play']:
			playing = False
		if request.json['preset']:
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
					data[request.json['theme']] = "rgb" + str(rgb)
				client.send_message("/cs/chan/at/" + str(v), " ")
				client.send_message("/cs/color/hs/" + str(h) + "/" + str(s), " ")
				i = i+1
			log = "Changing channels for " + request.json['theme']
			d.append(log)
		else:
			client.send_message("/cs/playback/go", " ")
			client.send_message("/cs/playback/pause", " ")
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
			log = "Changing channel " + str(request.json['chan']) + " to hsv: " + str(h) + ", " + str(s) + ", " + str(v) +" using OSC Commands: " + "/cs/chan/select/" + str(request.json['chan']) + "      /cs/chan/at/" + str(v) + "      /cs/color/hs/" + str(h) + "/" + str(s)
			d.append(log)
		client.send_message("/cs/key/clearselection", " ")
		with open('json/log.json', 'w') as logfile:
			json.dump(list(d),logfile)
		with open('json/data.json', 'w') as outfile:
			json.dump(data, outfile)
		return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
	else:
		return('Complete')
if __name__== "__main__":
	app.run(host='0.0.0.0', port=5000)

