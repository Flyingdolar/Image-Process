// Loading Spinner
const loading = document.getElementById("loadSpin");
// Input
const fileInput = document.getElementById("fileInput");
const gwNoiseVar = document.getElementById("gwVariance");
const saltPepperRate = document.getElementById("spRatio");
// Buttons
const importBtn = document.getElementById("importBtn");
const rotateBtn = document.getElementById("rotateBtn");
const histBtn = document.getElementById("histBtn");
const gwNoiseBtn = document.getElementById("gwNoiseBtn");
const spNoiseBtn = document.getElementById("spNoiseBtn");
const gwNoiseConfirm = document.getElementById("gwNoiseConfirm");
const spNoiseConfirm = document.getElementById("spNoiseConfirm");
// Image Boxs
const box = document.getElementsByClassName("image-box");
// Dropdown & Section
const noiseDrop = document.getElementById("noiseDrop");
const noiseSect = document.getElementById("noiseSect");
// Dialog
const gwNoiseDialog = document.getElementById("gaussianWNoise");
const spNoiseDialog = document.getElementById("saltPepperNoise");

// Variables
var lastAction = "none";

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
// -- 4. Get Box Image
function boxImg(boxNum) {
    return box[boxNum].getElementsByTagName("img")[0];
}
// -- 5. isLoading
function isLoading(state) {
    if (state == true)
        loading.style.display = "block";
    else
        loading.style.display = "none";
}
// ** End of Functions **

// ! Works that need to be done when the page is loaded
window.onload = () => {
    // Close All Boxes and Images
    closeAll();
    isLoading(false);
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
            isLoading(true);
            // EEL: Import Image
            eel.import_image("origin", url)(ret => {
                isLoading(false);
                if (!ret.success)
                    alert(ret.message);
                else
                    boxImg(0).src = getURL(ret.image);
                console.log(ret.success);
            });
        };
        reader.readAsDataURL(file);
    }
});

// TODO: Homework 1 - Rotate Image
rotateBtn.addEventListener("click", async () => {
    var imgIn = lastAction == "rotate" ? "rotate" : "origin";
    isLoading(true);
    // Setup visibilities
    closeAll(), openBoxs(1);
    lastAction = "rotate";
    // EEL: Rotate Image
    await eel.rotate_image(imgIn, "rotate", 30)(ret => {
        isLoading(false);
        if (!ret.success)
            alert(ret.message);
        else
            boxImg(1).src = getURL(ret.image);
    });
});

// TODO: Homework 2 - Show Histogram
histBtn.addEventListener("click", async () => {
    // Setup visibilities
    isLoading(true);
    closeAll(), openBoxs(1);
    lastAction = "hist";
    // EEL: Show Histogram
    await eel.show_histogram("origin", "hist")(ret => {
        isLoading(false);
        if (!ret.success)
            alert(ret.message);
        else
            boxImg(1).src = getURL(ret.image);
    });
});

// ? Noise Drop Down
noiseDrop.addEventListener("mouseover", () => {
    noiseSect.style.display = "flex";
});
noiseDrop.addEventListener("mouseout", () => {
    noiseSect.style.display = "none";
});

// TODO: Homework 3 - Add Noise - Gaussian White Noise
gwNoiseBtn.addEventListener("click", () => {
    gwNoiseDialog.showModal();
});
gwNoiseConfirm.addEventListener("click", async () => {
    // Setup visibilities
    gwNoiseDialog.close();
    closeAll(), openBoxs(2);
    var gwVar = gwNoiseVar.value;
    if (!Number.isInteger(Number(gwVar))) {
        alert("Variance must be an integer.");
        return;
    }
    lastAction = "noise-gaussian";
    isLoading(true);
    // EEL: Add Noise - Gaussian White Noise
    await eel.gen_GaussianW_noise("origin", "gaussianW", 127, gwVar)(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(1).src = "";
        } else
            boxImg(1).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of Gaussian White Noise
    await eel.show_histogram("gaussianW", "histGW")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(2).src = "";
        } else
            boxImg(2).src = getURL(ret.image);
    });
});
