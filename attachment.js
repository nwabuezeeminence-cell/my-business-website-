const imagePicker = document.getElementById("imagePicker");
const galleryBtn = document.getElementById("galleryBtn");

galleryBtn.onclick = () => {
    imagePicker.click();
};
imagePicker.onchange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

        showImagePreview(file, reader.result);

    };

    reader.readAsDataURL(file);

};
function showImagePreview(file, imageUrl){

    const preview = document.getElementById("imagePreview");

    document.getElementById("previewImage").src = imageUrl;

    preview.classList.add("active");

}