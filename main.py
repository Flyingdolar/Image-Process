import cv2
import numpy as np
import matplotlib.pyplot as plt
import base64, eel, os

# Set web files folder
eel.init("web")

# Create File Directory
if not os.path.exists("img"):
    os.makedirs("img")


# Transform base64 to image
def decode_base64(data):
    partData = data.split(",")
    encodeData = len(partData) > 1 and partData[1] or partData[0]
    byteData = base64.b64decode(encodeData)
    intData = np.frombuffer(byteData, dtype=np.uint8)
    img = cv2.imdecode(intData, cv2.IMREAD_UNCHANGED)
    return img


# Transform image to base64
def encode_base64(img):
    _, buffer = cv2.imencode(".jpg", img)
    b64Data = base64.b64encode(buffer)
    return b64Data.decode()


# TODO: Homework 0: Check Image
@eel.expose
def check_image(data):
    img = decode_base64(data)
    if img is None:
        # Case: Image Invalid (Not PPM, PNG, JPG, JPEG)
        return ""
    else:
        cv2.imwrite("img/origin.jpg", img)
        return encode_base64(img)


# TODO: Homework 1: Rotate Image
@eel.expose
def rotate_image(repeat):
    if repeat is True:
        img = cv2.imread("img/rotate.jpg")
    else:
        img = cv2.imread("img/origin.jpg")
    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
    # 另外一種做法，使用 numpy 進行矩陣旋轉
    # img = np.rot90(img, 1)
    cv2.imwrite("img/rotate.jpg", img)
    return encode_base64(img)


# Start up Window & Set Window Size
eel.start("index.html", size=(650, 550))
