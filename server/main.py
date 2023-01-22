from flask import Flask, Response, request
from flask_cors import CORS, cross_origin
from threading import Thread
import json
import base64

app = Flask('')
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

def run():
  app.run(host='0.0.0.0',port=8080)

def keep_alive():
    t = Thread(target=run)
    t.start()

@app.route("/fetch/", methods=["POST"])
def fetch_pis():
  # get the user's topics of interest and filter for PIs with this topic
  # append to an array and return as JSON
  d = request.get_json()
  uname = d["username"]
  type = d["userType"]

  if type in profiles and uname in profiles[type]:
    interests = profiles[type][uname]["topics"]
    pis = profiles["pi"]
    
    filtered_pis = filter_by_interests(pis, interests)
    d = {"pis": filtered_pis, "myTopics": interests}
    return d
  
  return Response("Failed to find user.", status=404)

def filter_by_interests(d, interests):
  new_d = {}

  for pi in d:
    for interest in interests:
      if interest in d[pi]["topics"]:
        new_d[pi] = d[pi].copy()
        if "pfp" in d[pi]:
          new_d[pi]["pfp"] = encode_img(d[pi]["pfp"])
        break

  return new_d

@app.route("/get/", methods=["POST"])
def get_profile(uname=None, type=None):
  if uname is None:
    d = request.get_json()
    uname = d['username']
    type = d["userType"]

    if type in profiles and uname in profiles[type]:
      return profiles[type][uname]
    else:
      return Response("Failed to find user.", status=404)
  else:
    if type in profiles and uname in profiles[type]:
      return profiles[type][uname]
    else:
      return {}
  

@app.route("/add/", methods=["POST"])
def add_profile():
  # Add the requested target (PI or Undergrad)
  # If they already exist, then tell them that the user already exists
  # make sure to save the user
  data = request.get_json()
  uname = data['username']
  type = data["userType"]

  if type in profiles:
    profiles[type][uname] = data

    if 'pfp' in data:
      img = save_image(data["pfp"], uname)
      profiles[type][uname]["pfp"] = img
      
    save_json(profiles, "user_profiles.json")
    return "added"
  else:
    return Response("User type does not exist.", status=666)

@app.route("/edit/", methods=["POST"])
def edit_user():
  # Change the info of a specific user
  # make sure to save the user
  data = request.get_json()
  uname = data['username']
  type = data["userType"]

  if type in profiles:
    if uname in profiles[type]:
      profiles[type][uname] = data
      if 'pfp' in data:
        img = save_image(data["pfp"], uname)
        profiles[type][uname]["pfp"] = img
      save_json(profiles, "user_profiles.json")
      return "good!"
    else:
      return Response("User does not exist.", status=999)
  else:
    return Response("User type does not exist.", status=666)

@app.route("/delete", methods=["POST"])
def delete_user():
  # make sure to save the user
    return "Not implemented yet."

#post will contain the username and password
@app.post("/login")
@cross_origin()
def login_user():
  #search in users.json for the username
  #hash the password
  #compare users.json["username"] == hashed_pw
  data = request.get_json()
  uname = data["username"]
  
  if data["username"] in users:
    profile = get_profile(uname, users[uname]["userType"])
    
    if len(profile) > 0:
      hasProfile = "true"
    else:
      hasProfile = ""
    
    pw = hash(data["password"])

    if pw == users[uname]["password"]:
      d = {"userType": users[uname]["userType"], "hasProfile": hasProfile}
      return d
      
    else:
      return Response("Password is incorrect, please try again.", status=420, mimetype="text/plain")
      
  else:
    return Response("The specified user does not exist", status=666, mimetype="text/plain")

@app.post("/signup")
@cross_origin()
def create_user():
  #search in users.json for the username
  #if already exists, error response
  #otherwise:
    #hash the password
    #add user and password
  #save the user
  print(users)
  data = request.get_json()
  uname = data["email"]
  
  if uname in users:
    return Response("The user already exists.", status=696)
    
  else:
    users[uname] = {"password": hash(data["password"]), "userType": ""}
    save_json(users, "users.json")
    return "We all good"

def save_image(b64, uname):
  fname = 'profiles/' + str(abs(hash(uname))) + get_file_ext(b64)
  with open(fname, "wb") as imgfile:
    imgfile.write(base64.b64decode(b64))
    return fname

def encode_img(fn):
  with open(fn, "rb") as imgfile:
    b64data = imgfile.read()
    base64_encoded_data = base64.b64encode(b64data).decode('utf-8')
    return base64_encoded_data

def get_file_ext(b64):
  d = {"/": ".jpg", "i": ".png"}
  return d[b64[0]]

def save_json(d, fn):
  with open(fn, "w") as outfile:
    json.dump(d, outfile)
    return

def load_json(fn):
  with open(fn) as data:
    return json.load(data)


users = load_json("users.json")
profiles = load_json("user_profiles.json")

keep_alive()