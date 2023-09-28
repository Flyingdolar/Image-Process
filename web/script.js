// File Input
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
// Feature Buttons
const feat1 = document.getElementById("featureBtn1");
const feat2 = document.getElementById("featureBtn2");
const feat3 = document.getElementsByClassName("dropDown")[0];
const feat3_1 = document.getElementById("noiseBtn1");
const feat3_2 = document.getElementById("noiseBtn2");
// Image Boxs
const box = document.getElementsByClassName("image-box");
// Section
var section = document.getElementsByClassName("section")[0];
var lastAction = "none";

// Works that need to be done when the page is loaded
window.onload = () => {
    // Close All Boxes and Images
    closeAll();
}

// ** Some Useful Functions **
// -- 1. Close All Boxes and Images
function closeAll() {
    for (var i = 1; i < box.length; i++) {
        box[i].style.display = "none";
        box[i].getElementsByTagName("img")[0].src = "";
    }
}
// -- 2. Open Image Boxs
function openBoxs(num) {
    for (var i = 1; i <= num; i++) {
        box[i].style.display = "flex";
    }
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
    lastAction = "import";
    if (file) {
        closeAll();
        const reader = new FileReader();
        reader.onload = (event) => {
            var url = event.target.result;

            // EEL: Import Image
            eel.import_image("origin", url)(ret => {
                if (!ret.success)
                    alert(ret.message);
                else
                    box[0].getElementsByTagName("img")[0].src = getURL(ret.image);
                console.log(ret.success);
            });
        };
        reader.readAsDataURL(file);
    }
});

// TODO: Homework 1 - Rotate Image
feat1.addEventListener("click", () => {
    var imgIn = lastAction == "rotate" ? "rotate" : "origin";
    // Setup visibilities
    closeAll(), openBoxs(1);
    lastAction = "rotate";
    // EEL: Rotate Image
    eel.rotate_image(imgIn, "rotate", 30)(ret => {
        if (!ret.success)
            alert(ret.message);
        else
            box[1].getElementsByTagName("img")[0].src = getURL(ret.image);
    });
});

// TODO: Homework 2 - Show Histogram
feat2.addEventListener("click", () => {
    // Setup visibilities
    closeAll(), openBoxs(1);
    lastAction = "hist";
    // EEL: Show Histogram
    eel.show_histogram("origin", "hist")(ret => {
        if (!ret.success)
            alert(ret.message);
        else
            box[1].getElementsByTagName("img")[0].src = getURL(ret.image);
    });
});

feat3.addEventListener("mouseover", () => {
    document.getElementsByClassName("section")[0].style.display = "flex";
});
feat3.addEventListener("mouseout", () => {
    document.getElementsByClassName("section")[0].style.display = "none";
});

// TODO: Homework 3 - Add Noise - Gaussian White Noise
feat3_1.addEventListener("click", () => {
    // Setup visibilities
    closeAll(), openBoxs(2);
    lastAction = "noise-gaussian";
    // EEL: Add Noise - Gaussian White Noise
    eel.gen_GaussianW_noise("origin", "gaussianW", 127, 10)(ret => {
        if (!ret.success)
            alert(ret.message);
        else
            box[1].getElementsByTagName("img")[0].src = getURL(ret.image);
    });
    // EEL: Draw Histogram of Gaussian White Noise
    eel.show_histogram("gaussianW", "histGW")(ret => {
        if (!ret.success)
            alert(ret.message);
        else
            box[2].getElementsByTagName("img")[0].src = getURL(ret.image);
    });
});
