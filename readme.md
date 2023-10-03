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
  git clone https://github.com/Flyingdolar/Image-Process.git
  ```

- Build the application using the following command:

1. On MacOS or Linux

    ```bash
    python -m eel main.py web --onefile --noconsole --hidden-import=queue -F -w
    ```

    - `-F` is for one file
    - `-w` is for windowed mode
    - `--noconsole` is for hiding the console
    - `--hidden-import=queue` is for fixing a bug on MacOS and Linux.

2. On Windows

    ```bash
    python -m eel main.py web --onefile
    ```

    - `--onefile` is for one file

- The executable file will be in the `dist` folder.

- Run the executable file.

  > its name is `main.exe` on Windows and `main` on MacOS and Linux.
