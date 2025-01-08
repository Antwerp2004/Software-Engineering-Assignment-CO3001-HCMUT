const applyButton = document.querySelector("#apply");
  
applyButton.addEventListener("click", () => {
    // Get input values
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const printerID = document.getElementById("printer-id").value;
    const studentID = document.getElementById("student-id").value;

    // Construct the query parameters
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (printerID) params.append("printerID", printerID);
    if (studentID) params.append("studentID", studentID);

    
    // Redirect to the destination link
    const destinationLink = `/admin/log?${params.toString()}`;
    window.location.href = destinationLink;

    // const formApplyFilter = document.querySelector("#form-apply-filter")
    // const path = formApplyFilter.getAttribute("data-path");
    // formApplyFilter.setAttribute("action", path + `?${params.toString()}`)
    // alert(`${formApplyFilter.getAttribute("action")}`)
    // formApplyFilter.submit();
});