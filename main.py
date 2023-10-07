import cv2
import numpy as np
import matplotlib.pyplot as plt
import base64
import eel
import os

# Set web files folder
eel.init("web")

# Create File Directory
if not os.path.exists("img"):
    os.makedirs("img")


# Set path for fileName
def set_path(fileName):
    return "img/" + fileName + ".bmp"


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
    _, buffer = cv2.imencode(".bmp", img)
    b64Data = base64.b64encode(buffer)
    return b64Data.decode()


# Check overflow
def check_overflow(value, limit):
    if value > limit:
        return limit
    elif value < 0:
        return 0
    else:
        return int(value)


# TODO Homework 0-1: Import Image
@eel.expose
def import_image(imgName, imgData):
    img = decode_base64(imgData)
    if img is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Invalid (Not PPM, PNG, JPG, JPEG)",
        }
    else:
        cv2.imwrite(set_path(imgName), img)
        return {
            "success": True,
            "image": encode_base64(img),
            "message": "Image Saved at " + set_path(imgName),
        }


# TODO Homework 0-2: Show Image
@eel.expose
def show_image(imgName):
    img = cv2.imread(set_path(imgName))
    if img is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Not Found in: " + set_path(imgName),
        }
    return {
        "success": True,
        "image": encode_base64(img),
        "message": "Image is Loaded from: " + set_path(imgName),
    }


# TODO Homework 1: Rotate Image
@eel.expose
def rotate_image(imgName_in, imgName_save, angle):
    img = cv2.imread(set_path(imgName_in))
    if img is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Not Found in: " + set_path(imgName_in),
        }
    height, width = img.shape[:2]
    center = (width / 2, height / 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1)
    img = cv2.warpAffine(img, matrix, (width, height))
    cv2.imwrite(set_path(imgName_save), img)
    return {
        "success": True,
        "image": encode_base64(img),
        "message": "Image Rotate " + str(angle) + " Degree",
    }


# TODO Homework 2: Show Histogram
@eel.expose
def show_histogram(imgName_in, imgName_save):
    img = cv2.imread(set_path(imgName_in))
    if img is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Not Found in: " + set_path(imgName_in),
        }
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plt.hist(img.ravel(), 256, [0, 255])
    plt.title("Histogram")
    plt.xlabel("Intensity"), plt.ylabel("Frequency")
    plt.savefig("img/" + imgName_save + ".jpg"), plt.close()
    plot = cv2.imread("img/" + imgName_save + ".jpg")
    cv2.imwrite(set_path(imgName_save), plot)
    # Remove .jpg file
    os.remove("img/" + imgName_save + ".jpg")
    return {
        "success": True,
        "image": encode_base64(cv2.imread(set_path(imgName_save))),
        "message": "Histogram is Saved at: " + set_path(imgName_save),
    }


# TODO Homework 3-1: Add Noise -- Gaussian White Noise
@eel.expose
def gen_GaussianW_noise(imgName_in, imgName_save, mean, sigma):
    img = cv2.imread(set_path(imgName_in))
    if img is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Not Found in: " + set_path(imgName_in),
        }
    mean = float(mean)
    sigma = float(sigma)
    height, width = img.shape[:2]
    resol = height * width
    # Create 1D zero Array base on resolution, then reshape to 2D with height and width
    noise = np.zeros(resol)
    # Create a for loop jump by 2
    for idx in range(0, resol, 2):
        if idx == resol - 1:
            noise[idx] = mean
            break
        r1 = np.random.uniform(0, 1)
        r2 = np.random.uniform(0, 1)
        r1 = np.sqrt(-2 * np.log(r1)) * sigma
        r2 = 2 * np.pi * r2
        p1 = int(r1 * np.cos(r2)) + mean
        p2 = int(r1 * np.sin(r2)) + mean
        noise[idx] = check_overflow(p1, 255)
        noise[idx + 1] = check_overflow(p2, 255)

    noise = noise.reshape(height, width)
    # Output Noise Image
    cv2.imwrite(set_path(imgName_save), noise)
    return {
        "success": True,
        "image": encode_base64(noise),
        "message": "Gaussian White Noise is Saved at: " + set_path(imgName_save),
    }


# TODO Homework 3-2: Add Noise -- Salt and Pepper Noise
@eel.expose
def gen_SaltPepper_noise(imgName_in, imgName_save, edge):
    img = cv2.imread(set_path(imgName_in))
    if img is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Not Found in: " + set_path(imgName_in),
        }
    edge = float(edge)
    height, width = img.shape[:2]
    resol = height * width
    # Set the image with all pixel to 127
    noise = np.full(resol, 127)
    low = int(edge * 255)
    high = 255 - low
    for pixel in range(resol):
        r = np.random.randint(0, 255)
        if r <= low:
            noise[pixel] = 0
        elif r >= high:
            noise[pixel] = 255
    noise = noise.reshape(height, width)
    # Output Noise Image
    cv2.imwrite(set_path(imgName_save), noise)
    return {
        "success": True,
        "image": encode_base64(noise),
        "message": "Salt and Pepper Noise is Saved at: " + set_path(imgName_save),
    }


# TODO Homework 3-3: Mix Image with Noise
@eel.expose
def mix_img(imgName_in, imgName_add, imgName_save, offset, isCover):
    img1 = cv2.imread(set_path(imgName_in))
    img2 = cv2.imread(set_path(imgName_add))
    # Read & Check Image with same size
    if img1 is None or img2 is None:
        return {
            "success": False,
            "image": None,
            "message": "Image Not Found in: "
            + set_path(imgName_in)
            + " or "
            + set_path(imgName_add),
        }
    elif img1.shape != img2.shape:
        return {
            "success": False,
            "image": None,
            "message": "Image Size Not Match",
        }
    if isCover:
        # Cover Image
        img = img1
        img2 = img2.astype(np.int32)
        for row in range(img2.shape[0]):
            for col in range(img2.shape[1]):
                if img2[row][col][0] + offset != 0:
                    img[row][col] = img2[row][col]
    else:
        # Mix Image
        img1 = img1.astype(np.int32)
        img2 = img2.astype(np.int32)
        img = img1 + (img2 + offset)
        img = np.clip(img, 0, 255)
        img = img.astype(np.uint8)
    # Output Image
    cv2.imwrite(set_path(imgName_save), img)
    return {
        "success": True,
        "image": encode_base64(img),
        "message": "Image is Saved at: " + set_path(imgName_save),
    }


# Start up Window & Set Window Size
eel.start("index.html", size=(1000, 800))
