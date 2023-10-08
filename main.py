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
    return "img/" + fileName + ".png"


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
    _, buffer = cv2.imencode(".png", img)
    b64Data = base64.b64encode(buffer)
    return b64Data.decode()


# Define Return Format
def formData(success, img, msg):
    print(success and ("S: " + msg) or ("F: " + msg))
    return {
        "success": success,
        "image": encode_base64(img),
        "message": msg,
    }


# TODO Homework 0: Import Image
@eel.expose
def import_image(imgName, imgData):
    try:
        # Decode Base64
        img = decode_base64(imgData)
        if img is None:
            raise Exception("Image Not Found")
        # Return Result
        cv2.imwrite(set_path(imgName), img)
        return formData(True, img, "Image Imported")
    except Exception as errMsg:
        formData(False, None, str(errMsg))


# TODO Homework 1: Rotate Image
@eel.expose
def rotate_image(imgName_in, imgName_save, angle):
    try:
        # Read Image
        img = cv2.imread(set_path(imgName_in))
        if img is None:
            raise Exception("Image Not Found at: " + set_path(imgName_in))
        # Get Rotation Matrix
        height, width = img.shape[:2]
        center = (width / 2, height / 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1)
        # Set New Image Size with Rotation
        cos = np.abs(matrix[0, 0])
        sin = np.abs(matrix[0, 1])
        new_width = int((height * sin) + (width * cos))
        new_height = int((height * cos) + (width * sin))
        # Adjust Matrix for Translation
        matrix[0, 2] += (new_width / 2) - center[0]
        matrix[1, 2] += (new_height / 2) - center[1]
        # Rotate Image with Matrix
        img = cv2.warpAffine(
            img,
            matrix,
            (new_width, new_height),
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(255, 255, 255),
        )
        # Return Result
        cv2.imwrite(set_path(imgName_save), img)
        return formData(True, img, "Image Rotated " + str(angle) + " Degree")
    except Exception as errMsg:
        formData(False, None, str(errMsg))


# TODO Homework 2: Show Histogram
@eel.expose
def show_histogram(imgName_in, imgName_save):
    try:
        # Read Image
        img = cv2.imread(set_path(imgName_in))
        if img is None:
            raise Exception("Image Not Found at: " + set_path(imgName_in))
        # Convert to Grayscale
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Setup Histogram
        plt.hist(img.ravel(), 256, [0, 255])
        plt.title("Histogram")
        plt.axis([-1, 256, 0, None])
        plt.xlabel("Intensity"), plt.ylabel("Frequency")
        # Save Histogram
        plt.savefig(set_path(imgName_save))
        plt.clf()  # Clear Figure
        # Return Result
        retImg = cv2.imread(set_path(imgName_save))
        return formData(True, retImg, "Histogram Created")
    except Exception as errMsg:
        formData(False, None, str(errMsg))


# TODO Homework 3-1: Add Noise -- Gaussian White Noise
@eel.expose
def gen_GaussianW_noise(imgName_in, imgName_save, mean, sigma):
    try:
        # Read Image
        img = cv2.imread(set_path(imgName_in))
        if img is None:
            raise Exception("Image Not Found in: " + set_path(imgName_in))
        # Create Noise Image with Same Resolution
        height, width = img.shape[:2]
        resol = height * width
        noise = np.zeros(resol)
        # Apply Gaussian White Noise with Mean & Sigma
        for idx in range(0, resol, 2):
            if idx == resol - 1:
                noise[idx] = float(mean)
                break
            # Generate 2 Random Numbers with Normal Distribution
            r1 = np.sqrt(-2 * np.log(np.random.uniform(0, 1))) * float(sigma)
            r2 = 2 * np.pi * np.random.uniform(0, 1)
            p1 = int(r1 * np.cos(r2) + float(mean))
            p2 = int(r1 * np.sin(r2) + float(mean))
            # Clip Pixel Value to 0 ~ 255
            noise[idx] = np.clip(p1, 0, 255)
            noise[idx + 1] = np.clip(p2, 0, 255)
        # Reshape Noise Image (1D -> 2D)
        noise = noise.reshape(height, width)
        # Return Result
        cv2.imwrite(set_path(imgName_save), noise)
        return formData(
            True, noise, "Gaussian White Noise Generated with sigma " + str(sigma)
        )
    except Exception as errMsg:
        formData(False, None, str(errMsg))


# TODO Homework 3-2: Add Noise -- Salt and Pepper Noise
@eel.expose
def gen_SaltPepper_noise(imgName_in, imgName_save, edge):
    try:
        # Read Image
        img = cv2.imread(set_path(imgName_in))
        if img is None:
            raise Exception("Image Not Found in: " + set_path(imgName_in))
        # Create Noise Image with Same Resolution
        height, width = img.shape[:2]
        resol = height * width
        noise = np.full(resol, 127)
        # Set Pepper & Salt Boundary
        low = int(float(edge) * 255)  # Pepper
        high = 255 - low  # Salt
        # Apply Salt and Pepper Noise
        for pixel in range(resol):
            r = np.random.randint(0, 255)
            if r <= low:  # Pepper
                noise[pixel] = 0
            elif r >= high:  # Salt
                noise[pixel] = 255
        # Reshape Noise Image (1D -> 2D)
        noise = noise.reshape(height, width)
        # Output Noise Image
        cv2.imwrite(set_path(imgName_save), noise)
        return formData(
            True, noise, "Salt and Pepper Noise Generated with edge " + str(edge)
        )
    except Exception as errMsg:
        formData(False, None, str(errMsg))


# TODO Homework 3-3: Mix Image with Noise
@eel.expose
def mix_img(imgName_in, imgName_add, imgName_save, offset, isCover):
    try:
        img1 = cv2.imread(set_path(imgName_in))
        img2 = cv2.imread(set_path(imgName_add))
        # Read & Check Image with same size
        if img1 is None or img2 is None:
            raise Exception("Image Not Found")
        elif img1.shape != img2.shape:
            raise Exception("Image Size Not Match")

        # Convert to int32 for calculation
        img1 = img1.astype(np.int32)
        img2 = img2.astype(np.int32)
        if bool(isCover):  # Cover Image
            img2 = img2.astype(np.int32)
            for row in range(img2.shape[0]):
                for col in range(img2.shape[1]):
                    if img2[row][col][0] + int(offset) != 0:
                        img1[row][col] = img2[row][col]
        else:  # Mix Image
            img1 = img1 + (img2 + int(offset))
            img1 = np.clip(img1, 0, 255)
        # Output Image
        img1 = img1.astype(np.uint8)
        cv2.imwrite(set_path(imgName_save), img1)
        return formData(
            True, img1, "Image Mixed with " + imgName_in + " & " + imgName_add
        )
    except Exception as errMsg:
        formData(False, None, str(errMsg))


# Start up Window & Set Window Size
eel.start("index.html", size=(1000, 800))
