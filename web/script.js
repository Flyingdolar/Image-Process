// File Input
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
// Feature Buttons
const feat1 = document.getElementById("featureBtn1");
const feat2 = document.getElementById("featureBtn2");
const feat3 = document.getElementById("featureBtn3");
// Image Boxs
const box1 = document.getElementById("imageBox1");
const box2 = document.getElementById("imageBox2");
const box3 = document.getElementById("imageBox3");
const box4 = document.getElementById("imageBox4");
const box5 = document.getElementById("imageBox5");
const box6 = document.getElementById("imageBox6");
// Preview Images
const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const image4 = document.getElementById("image4");
const image5 = document.getElementById("image5");
const image6 = document.getElementById("image6");

// Works that need to be done when the page is loaded
window.onload = () => {
    // Close All Boxes and Images
    closeAll();
}

// ** Some Useful Functions **
// -- 1. Show/Hide Image Box
function setVisible(element, visible) {
    if (visible === "hide") element.style.display = "none";
    else element.style.display = "flex";
}
// -- 2. Close All Boxes and Images
function closeAll() {
    // Reset All Images src
    image2.src = "", image3.src = "", image4.src = "", image5.src = "", image6.src = "";
    // Let All Boxes Hide
    setVisible(box2, "hide"), setVisible(box3, "hide"), setVisible(box4, "hide");
    setVisible(box5, "hide"), setVisible(box6, "hide");
}
// -- 3. Get URL from Base64
function getURL(base64) {
    // Get Bytes
    var bString = atob(base64);
    var bLength = bString.length;
    var bytes = new Uint8Array(bLength);
    for (var i = 0; i < bLength; i++) {
        var ascii = bString.charCodeAt(i);
        bytes[i] = ascii;
    }
    // Create Blob and get URL
    var blob = new Blob([bytes], { type: "image/png" });
    var url = URL.createObjectURL(blob);
    return url;
}

// TODO: Homework 0 - Import Image
importBtn.addEventListener("click", () => {
    fileInput.click();  // Redirect Import Button Click to File Input
});

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        closeAll();
        const reader = new FileReader();
        reader.onload = (event) => {
            var url = event.target.result;
            // Check url is Image or not from eel
            eel.check_image(url)(result => {
                if (result) image1.src = getURL(result);
                else alert("Please import an image!");
            });
        };
        reader.readAsDataURL(file);
    }
});

// TODO: Homework 1 - Rotate Image
feat1.addEventListener("click", () => {
    var repeat = box2.style.display == "flex" ? true : false;

    if (image1.src === "") return;  // No Image
    if (!repeat) {
        closeAll();
        setVisible(box2, "show"), setVisible(image2, "show");
    }
    // Get the rotate image from eel
    eel.rotate_image(repeat)(result => {
        image2.src = getURL(result)
    });
});

// TODO: Homework 2 - Show Histogram
feat2.addEventListener("click", () => {
    if (image1.src === "") return;  // No Image
    closeAll();
    setVisible(box3, "show"), setVisible(image3, "show");
    // Get the histogram from eel
    eel.show_histogram()(result => {
        image3.src = getURL(result)
    });
});

// TODO: Homework 3 - Add Noise
feat3.addEventListener("click", () => {
    // Do some work here...
});