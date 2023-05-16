# Dab Detection
This code is designed to detect the "dab" gesture using pose estimation from a video feed. It utilizes the ml5.js library and the PoseNet model for real-time pose estimation.

## Setup

Install the necessary dependencies and libraries.
Create a canvas element with a size of 640x480 pixels.
Create a video capture element and set its size to match the canvas.
Initialize PoseNet by creating a new instance with the video feed and a callback function to be executed when the model is ready.
Set up an event listener for the "pose" event, which updates the global "poses" variable with an array of detected poses.
Hide the video element to only display the canvas.

## Functions

***findAngle(p1, p2, p3)***
Calculates the angle between three given points (p1, p2, p3). Returns the angle in degrees.

***validatePoses()***
Validates whether all the required body parts for dab detection are being tracked.
If any required body part's confidence is below 0.5, it returns false.
Otherwise, it populates the tracker object with the x and y coordinates of the tracked body parts and returns true.

***checkForDab()***
Checks if all the required body parts are being tracked by calling validatePoses().
Calculates the angles between the tracked body parts to determine if a dab is being performed.
Interpolates the angles to percentages based on predefined thresholds.
Calculates a total percentage based on the interpolation of all the angles.
Returns a corresponding message based on the total percentage.

***drawLine(partA, partB)***
Draws a red line between two body parts (partA and partB) on the canvas.

## Usage

 - Set up the required dependencies and libraries.  Ensure that a video
   capture device is available.  
   
 - Run the code.  
 - A canvas will be displayed, and the video feed will be processed by PoseNet.  
 - The code will track the required body parts and check for the dab gesture.  
 - The result of the dab detection will be displayed on the canvas. 
 - If a dab is detected, the lines connecting the tracked body parts will
   be drawn in red.

**Note: Make sure to position yourself correctly in front of the camera to enable accurate pose estimation.**

*Feel free to modify the code to fit your specific requirements or integrate it into your own projects!*
