from django.shortcuts import render, HttpResponse, redirect
from .models import *
from django.contrib import messages
import bcrypt
import cv2
import sys
import imutils
import math
import base64
import json
import requests
import datetime
from django.http.response import JsonResponse
from pathlib import Path
# from os.path import realpath, normpath

session = {
    'id': 0,
}

def check(request):
    if session['id'] > 0:
        print('Already logged in')
        user = User.objects.get(id = session['id'])
        created = user.created_at.strftime("%B")+' '+str(user.created_at.year)
        context = {
            'logged_in': True,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'created': created
        }
        # jacob = User.objects.create(first_name=context['first_name'],last_name=context['last_name'],email='dragon@dragon.com',password=password).id
    else:
        print('Please log in')
        context = {
            'logged_in': False
        }
    return HttpResponse(json.dumps(context), content_type="application/json")

def register(request):
    print("Register")
    body = json.loads(request.body.decode('utf-8'))
    print(body)
    errors = User.objects.basic_validator(body)
    if len(errors):
        return HttpResponse(json.dumps(errors), content_type="application/json")
    else:
        if body['precheck'] == True:
            context = {
                'precheck': True
            }
            print("You are ready to register")
            return HttpResponse(json.dumps(context), content_type="application/json")
        password = bcrypt.hashpw(body['password'].encode(), bcrypt.gensalt()).decode()
        User.objects.create(first_name = body['first_name'], last_name = body['last_name'], email = body['email'], password = password)
        session['id'] = User.objects.get(email = body['email']).id
        session['time'] = datetime.datetime.now()
        context = {
            'success': 'success'
        }
        print("success")
        return HttpResponse(json.dumps(context), content_type="application/json")

def capture(request):
    body = json.loads(request.body.decode('utf-8'))
    print(body['demo'])
    with open("face.jpeg", "wb") as fh:
        fh.write(base64.b64decode(body['img_data']))
    image = cv2.imread("face.jpeg")
    image = imutils.resize(image, width=600)
    cv2.imwrite('face.jpeg',image)
     # Create the haar cascade
    p = Path(__file__).parents[3]/'faceEnv'/'Lib'/'site-packages'/'cv2'/'data/'
    faceCascade = cv2.CascadeClassifier(str(Path(p)/'haarcascade_frontalface_alt.xml'))
    eyeCascade = cv2.CascadeClassifier(str(Path(p)/'haarcascade_eye.xml'))
    smileCascade = cv2.CascadeClassifier(str(Path(p)/'haarcascade_smile.xml'))
    # Read the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.5,
        minNeighbors=5,
        minSize=(20, 20),
        maxSize = (400, 400)
    )
    errors = {}
    print("Found {0} faces!".format(len(faces)), faces)
    if (len(faces)>0):
        # Draw a rectangle around the faces
        for (x, y, w, h) in faces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
            print('FACE',x, "left",y, "top",x+w, "right",y+h,"bottom",w,h)
            fwid=w
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = image[y:y+h, x:x+w]
            eyes = eyeCascade.detectMultiScale(
                roi_gray,
                scaleFactor=1.01,
                minNeighbors=5,
                minSize=(52, 52),
                maxSize=(65, 65)
            )
            hairline = 0
            ebot = 0
            eyewid = []
            for (ex,ey,ew,eh) in eyes:
                cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,0,255),2)
                print('EYE', "left", ex, "top", ey, "right", ex+ew,"bottom", ey+eh, "width", ew, "height", eh)
                hairline = hairline+ey+eh/2
                ebot = ebot + (ey+eh)/2
                eyewid = eyewid+[ex]
                eyewid = eyewid+[ex+ew]
            smiles = smileCascade.detectMultiScale(
                roi_gray,
                scaleFactor=1.2,
                minNeighbors=5,
                minSize=(50, 130),
                maxSize=(100, 200)
            )
            for (ex,ey,ew,eh) in smiles:
                cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(255,0,0),2)
                mwid=ew
                mtop=ey
                mbot=ey+eh
                mleft = ex
                mright = ex+ew
                print('MOUTH', "left", ex, "top", ey, "right", ex+ew, "bottom", ey+eh, "width", ew ,"height", eh)
                errors = {}
        if len(faces) > 1:
            errors["faces"] = "Multiple faces detected please take another picture"
        elif len(eyes) > 2:
            errors["eyes"] = "More than 2 eyes detected please take another picture"
        elif len(eyes) < 2:
            errors["eyes"] = "Less than 2 eyes detected please take another picture"
        elif len(smiles) > 1:
            errors["smiles"] = "Multiple mouths detected please take another picture"
        elif len(smiles) < 1:
            errors["smiles"] = "No mouths detected please take another picture"
        if len(errors):
            print('these are the errors', errors)
            print(errors)
            cv2.imwrite('face.jpeg',image)
            print('wrote image')
            #context objects to kickback
            with open('face.jpeg', "rb") as image_file:
                encoded_string = str(base64.b64encode(image_file.read()))  
                encoded_string=encoded_string[2:-1]
            context_before = {
                    "error": errors,
                    "image": encoded_string
                }
            print('reached 246')
            # return requests.post('http:local:4200/', context)
            return HttpResponse(json.dumps(context_before), content_type="application/json")

        else:
            #calculations
            print('reached else')
            mofa = mwid/fwid
            chinheight = fwid-mbot
            hairline = hairline/2
            hairtomouth1 = math.atan((mleft-eyewid[0])/(mbot-hairline))*180/math.pi
            hairtomouth2 = math.atan((eyewid[3]-mright)/(mbot-hairline))*180/math.pi
            chinhypo = (chinheight**2+(mwid/2)**2)**0.5
            chinangle = 180 - 2*math.asin(chinheight/chinhypo)*180/math.pi
            hairangle = (hairtomouth1+hairtomouth2)/2
            print(mofa, chinangle, hairangle,eyewid)

            #shape classifier
            if (hairangle>16 or hairangle<-16):
                if (chinangle<110):
                    shape = "heart"
                else:
                    shape = "round"
            if (hairangle<=16 and hairangle>=-16):
                if (chinangle<110):
                    shape = "diamond"
                else:
                    if(mofa<0.4):
                        shape = "oval"
                    else:
                        shape = "square"

            cv2.imwrite('face.jpeg',image)
            print('wrote image')
            #context objects to kickback
            with open('face.jpeg', "rb") as image_file:
                encoded_string = str(base64.b64encode(image_file.read()))   
                encoded_string=encoded_string[2:-1]
            if(body['demo'] == False):
                user = User.objects.get(id = session['user_id'])
                Face.models.create(chin_angle = chinangle, mofa_ratio = mofa, hlmo_ratio = hairangle, shape = shape, image = encoded_string, user = user)
            context_before = {
                    "error": False,
                    "shape": shape,
                    "image": encoded_string
                }
            print("No issues")
            return HttpResponse(json.dumps(context_before), content_type="application/json")
    else:    
        errors["faces"] = "No faces detected please take another picture"
        print(errors)
        cv2.imwrite('face.jpeg',image)
        print('wrote image')
        #context objects to kickback
        with open('face.jpeg', "rb") as image_file:
            encoded_string = str(base64.b64encode(image_file.read()))
            encoded_string=encoded_string[2:-1]  
        context_before = {
                "error": errors,
                "image": encoded_string
            }
        # return requests.post('http:local:4200/', context)
        return HttpResponse(json.dumps(context_before), content_type="application/json")
        
def login(request):
    print("Login")
    print(request.body)
    body = json.loads(request.body.decode('utf-8'))
    print(type(body))
    errors = User.objects.login_validator(body)
    if len(errors):
        print(errors)
        return HttpResponse(json.dumps(errors), content_type="application/json")
    else:
        session = User.objects.get(email = body['email'])
        creation = str(session.created_at.strftime("%B")) + ' ' + str(session.created_at.year)
        print(creation)
        context_before = {
                # 'shapes': Face.objects.filter(user = User.objects.get(id = user_id)).shape,
                # 'images': Face.objects.filter(user = User.objects.get(id = user_id)).image,
                'success': 'success',
                'id':  session.id,
                'first_name': session.first_name,
                'last_name':  session.last_name,
                'email':  session.email,
                'created':  creation,
            }
        print("success")
        return HttpResponse(json.dumps(context_before), content_type="application/json")

def logout(request):
    session['id'] = 0
    logged_out = {
        "logged_in": False
    }
    return HttpResponse(json.dumps(logged_out), content_type="application/json")