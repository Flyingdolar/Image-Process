import cv2
import eel
import numpy as np
import matplotlib.pyplot as plt

eel.init('web')
eel.start('index.html', size=(600, 400))

@eel.expose
def hello_world():
    return "Hello from python"

# Get the image from frotend and rotate it
# Frontend Called as: eel.rotate_image(image_path, direction<0 or 1>)(callback)
@eel.expose
def rotate_image(image_path, direction):
    image = cv2.imread(image_path)
    if direction == 0:
        image = cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    else:
        image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite(image_path, image)
