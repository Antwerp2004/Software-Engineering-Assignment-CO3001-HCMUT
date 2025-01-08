const formFilter = document.querySelector("#filter")

formFilter.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const printerId = document.getElementById('printerId').value;

    // Build the query parameters
    const params = new URLSearchParams();

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (printerId) params.append('printerID', printerId);

    // Redirect to the same page with query parameters
    window.location.href = `${window.location.pathname}?${params.toString()}`;

    // const applyFiltersButton = document.getElementById('applyFilters');

    // applyFiltersButton.addEventListener('click', () => {
        
    // });
});
