// Loading Spinner
const loading = document.getElementById("loadSpin");
// Input
const fileInput = document.getElementById("fileInput");
const rotateAngle = document.getElementById("rotateAngle");
const gwNoiseVar = document.getElementById("gwVariance");
const saltPepperRate = document.getElementById("spRatio");
const convMatrix3 = document.getElementsByClassName("convMatrix3");
const convMatrix5 = document.getElementsByClassName("convMatrix5");
const convMatrix7 = document.getElementsByClassName("convMatrix7");
// Buttons
const importBtn = document.getElementById("importBtn");
const rotateBtn = document.getElementById("rotateBtn");
const histBtn = document.getElementById("histBtn");
const gwNoiseBtn = document.getElementById("gwNoiseBtn");
const spNoiseBtn = document.getElementById("spNoiseBtn");
const convBtn = document.getElementById("convBtn");
const equalizeBtn = document.getElementById("equalizeBtn");
// Confirm Buttons
const rotateConfirm = document.getElementById("rotateConfirm");
const gwNoiseConfirm = document.getElementById("gwNoiseConfirm");
const spNoiseConfirm = document.getElementById("spNoiseConfirm");
const convSizeConfirm = document.getElementById("convSizeConfirm");
const convConfirm = document.getElementById("convConfirm");
// Image Boxs
const box = document.getElementsByClassName("image-box");
// Dropdown & Section
const noiseDrop = document.getElementById("noiseDrop");
const noiseSect = document.getElementById("noiseSect");
// Dialog
const rotateDialog = document.getElementById("rotateDialog");
const gwNoiseDialog = document.getElementById("gaussianWNoise");
const spNoiseDialog = document.getElementById("saltPepperNoise");
const convSizeDialog = document.getElementById("convSizeDialog");
const convDialog = document.getElementById("convDialog");

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

// [v]: Homework 0 - Import Image
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

// [v]: Homework 1 - Rotate Image
rotateBtn.addEventListener("click", () => {
    rotateDialog.showModal();
});
rotateConfirm.addEventListener("click", async () => {
    // Setup visibilities
    rotateDialog.close();
    closeAll(), openBoxs(1);
    var angle = rotateAngle.value;
    if (!Number.isInteger(Number(angle))) {
        alert("Angle must be an integer.");
        return;
    }
    angle = angle % 360;
    if (angle < 0) angle += 360;
    lastAction = "rotate";
    isLoading(true);
    // EEL: Rotate Image
    await eel.rotate_image("origin", "rotate", angle)(ret => {
        isLoading(false);
        if (!ret.success)
            alert(ret.message);
        else
            boxImg(1).src = getURL(ret.image);
    });
});

// [v]: Homework 2 - Show Histogram
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

// [v]: Noise Drop Down
noiseDrop.addEventListener("mouseover", () => {
    noiseSect.style.display = "flex";
});
noiseDrop.addEventListener("mouseout", () => {
    noiseSect.style.display = "none";
});

// [v]: Homework 3 - Add Noise - Gaussian White Noise
gwNoiseBtn.addEventListener("click", () => {
    gwNoiseDialog.showModal();
});
gwNoiseConfirm.addEventListener("click", async () => {
    // Setup visibilities
    gwNoiseDialog.close();
    closeAll(), openBoxs(5);
    var gwVar = gwNoiseVar.value;
    if (!Number.isInteger(Number(gwVar))) {
        alert("Variance must be an integer.");
        return;
    }
    lastAction = "noise-gaussian";
    isLoading(true);
    // EEL: Generate Gaussian White Noise
    await eel.gen_GaussianW_noise("origin", "noiseGW", 127, gwVar)(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(1).src = "";
        } else
            boxImg(1).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Mix Image
    await eel.mix_image("origin", "noiseGW", "mixGW", -127, false)(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(2).src = "";
        } else
            boxImg(2).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of original image
    await eel.show_histogram("origin", "hist")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(3).src = "";
        } else
            boxImg(3).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of Gaussian White Noise
    await eel.show_histogram("noiseGW", "histGW")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(4).src = "";
        } else
            boxImg(4).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of mixed image
    await eel.show_histogram("mixGW", "histMixGW")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(5).src = "";
        } else
            boxImg(5).src = getURL(ret.image);
    });
});

// [v]: Homework 3 - Add Noise - Salt and Pepper Noise
spNoiseBtn.addEventListener("click", () => {
    spNoiseDialog.showModal();
});
spNoiseConfirm.addEventListener("click", async () => {
    // Setup visibilities
    spNoiseDialog.close();
    closeAll(), openBoxs(5);
    var spRate = saltPepperRate.value;
    if (spRate > 50 || spRate < 0) {
        alert("Illegal ratio.");
        return;
    }
    spRate /= 100;
    lastAction = "noise-sp";
    isLoading(true);
    // EEL: Add Noise - Salt and Pepper Noise
    await eel.gen_SaltPepper_noise("origin", "noiseSP", spRate)(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(1).src = "";
        } else
            boxImg(1).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Add Noise to original image
    await eel.mix_image("origin", "noiseSP", "mixSP", -127, true)(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(2).src = "";
        } else
            boxImg(2).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of original image
    await eel.show_histogram("origin", "hist")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(3).src = "";
        } else
            boxImg(3).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of Salt and Pepper Noise
    await eel.show_histogram("noiseSP", "histSP")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(4).src = "";
        } else
            boxImg(4).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of mixed image
    await eel.show_histogram("mixSP", "histMixSP")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(5).src = "";
        } else
            boxImg(5).src = getURL(ret.image);
    });
});

// [v] Homework 4 - Convolution
convBtn.addEventListener("click", () => {
    convSizeDialog.showModal();
    // Set All Matrix Invisible
    for (var i = 0; i < convMatrix3.length; i++)
        convMatrix3[i].style.display = "none";
    for (var i = 0; i < convMatrix5.length; i++)
        convMatrix5[i].style.display = "none";
    for (var i = 0; i < convMatrix7.length; i++)
        convMatrix7[i].style.display = "none";
});
convSizeConfirm.addEventListener("click", () => {
    convSizeDialog.close();
    convDialog.showModal();
    // Set Matrix Visible
    var size = parseInt(document.querySelector('input[name="convSize"]:checked').value);
    if (size == 3) {
        for (var i = 0; i < convMatrix3.length; i++)
            convMatrix3[i].style.display = "inline";
    } else if (size == 5) {
        for (var i = 0; i < convMatrix5.length; i++)
            convMatrix5[i].style.display = "inline";
    } else if (size == 7) {
        for (var i = 0; i < convMatrix7.length; i++)
            convMatrix7[i].style.display = "inline";
    }
});
convConfirm.addEventListener("click", async () => {
    // Setup visibilities
    convDialog.close();
    closeAll(), openBoxs(2);
    lastAction = "conv";

    var size = parseInt(document.querySelector('input[name="convSize"]:checked').value);
    var matrix = [];
    if (size == 3) {
        for (var i = 0; i < convMatrix3.length; i++)
            matrix.push(convMatrix3[i].value);
    } else if (size == 5) {
        for (var i = 0; i < convMatrix5.length; i++)
            matrix.push(convMatrix5[i].value);
    } else if (size == 7) {
        for (var i = 0; i < convMatrix7.length; i++)
            matrix.push(convMatrix7[i].value);
    }
    console.log(matrix);
    isLoading(true);
    // EEL: Convolution
    await eel.conv_image("origin", "conv", matrix)(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(1).src = "";
        } else
            boxImg(1).src = getURL(ret.image);
    });
    isLoading(true);
    // EEL: Draw Histogram of convoluted image
    await eel.show_histogram("conv", "histConv")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(2).src = "";
        } else
            boxImg(2).src = getURL(ret.image);
    });
});

// [ ] Homework 5 - Histogram Equalization
equalizeBtn.addEventListener("click", async () => {
    closeAll(), openBoxs(4);
    lastAction = "equalize";
    isLoading(true);
    // EEL: Histogram Equalization
    await eel.equalize_image("origin", "equalize")(ret => {
        isLoading(false);
        if (!ret.success) {
            alert(ret.message);
            boxImg(1).src = "";
        } else
            boxImg(1).src = getURL(ret.image);
    });
    // EEL: Draw Histogram of original image
    await eel.show_histogram("origin", "hist")(ret => {
        if (!ret.success) {
            alert(ret.message);
            boxImg(3).src = "";
        } else
            boxImg(3).src = getURL(ret.image);
    });
    // EEL: Draw Histogram of equalized image
    await eel.show_histogram("equalize", "histEqualize")(ret => {
        if (!ret.success) {
            alert(ret.message);
            boxImg(4).src = "";
        } else
            boxImg(4).src = getURL(ret.image);
    });
});
