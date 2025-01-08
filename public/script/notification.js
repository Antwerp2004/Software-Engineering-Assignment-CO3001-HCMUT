// Show notification
const showNotification = document.querySelector("[show-notification]");
if (showNotification) {
    const time = parseInt(showNotification.getAttribute("data-time"));
    const closeNotification = showNotification.querySelector("[close-notification]");

    setTimeout(() => {
        showNotification.classList.add("notification-hidden");
    }, time)

    closeNotification.addEventListener("click", () => {
        showNotification.classList.add("notification-hidden");
    })
}
// End Show notification