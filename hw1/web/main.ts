var imgInput = document.getElementById('imgInput');
var inputBtn = document.getElementById('inputBtn');

function inputFile() {
    document.getElementById('imgInput')?.click();
}

// Preview Image in Div Container
function showPreview(files: FileList) {
    var preview = document.getElementById('imageContainer');
    var file = files[0];
    var reader = new FileReader();

    console.log(file);
    reader.onloadend = function () {
        if (preview != null)
            preview.style.backgroundImage = "url(" + reader.result + ")";
    }

    if (file)
        reader.readAsDataURL(file);
    else if (preview != null)
        preview.style.backgroundImage = "";
}
