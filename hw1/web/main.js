"use strict";
var imgInput = document.getElementById('imgInput');
var inputBtn = document.getElementById('inputBtn');
function inputFile() {
    var _a;
    (_a = document.getElementById('imgInput')) === null || _a === void 0 ? void 0 : _a.click();
}
// Preview Image in Div Container
function showPreview(files) {
    var preview = document.getElementById('imageContainer');
    var file = files[0];
    var reader = new FileReader();
    console.log(file);
    reader.onloadend = function () {
        if (preview != null)
            preview.style.backgroundImage = "url(" + reader.result + ")";
    };
    if (file)
        reader.readAsDataURL(file);
    else if (preview != null)
        preview.style.backgroundImage = "";
}
