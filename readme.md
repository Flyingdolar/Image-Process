# Image Processing Application

## Description

An Application that allows to do several image processing operations on images.

## Features

- [x] Load/Export
- [x] Image Rotation
- [ ] Draw Histogram
- [ ] Apply Noise

## Frameworks

- Python: As the main programming language.
  - Eel: Communication between Python and HTML/CSS/JS.
  - OpenCV: For image processing.
- HTML/CSS/JS: For the GUI.

## Getting Started

### 1. Prerequisites

- Python 3.7 or higher.
- Pip.
- Install the required packages using the following command:

  ```bash
  pip install -r requirements.txt
  ```

  > Reminder: On MacOS, you need to use `pip3` instead of `pip`.
  >
  > By the way, use `python3` instead of `python` if you have both Python 2 and 3 installed.

### 2. Installation

- Clone the repository using the following command:

  ```bash
  git clone http://example.com
  ```

- Build the application using the following command:

  ```bash
  python -m eel main.py web --onefile --noconsole --hidden-import=queue -F -w
  ```

- The executable file will be in the `dist` folder.

- Run the executable file.

  > its name is `main.exe` on Windows and `main` on MacOS and Linux.
