const printerLocationEle = document.querySelector("#printer-location");
const printerIDEle = document.querySelector("#printer-id")
printerIDEle.value = ""

printerLocationEle.addEventListener("change", () => {
    const optionList = printerIDEle.childNodes;
    const location = printerLocationEle.value;

    let firstVisibleOption = null;

    optionList.forEach((option) => {
        if (option.classList.contains(location)) {
            option.style.display = "block"; // Show matching options
            option.disabled = false; 
            if (!firstVisibleOption) {
                firstVisibleOption = option; // Save the first visible option
            }
        } else {
            option.style.display = "none"; // Hide non-matching options
            option.disabled = true; 
        }
    })

    printerIDEle.value = firstVisibleOption ? firstVisibleOption.value : "";
})