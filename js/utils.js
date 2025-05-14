const ITEMS_PER_PAGE = 10;

function createPagination(totalItems, currentPage, pageType) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination">';

    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1}, '${pageType}')">&lt;</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i}, '${pageType}')">${i}</button>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1}, '${pageType}')">&gt;</button>`;
    }

    paginationHTML += '</div>';

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    paginationHTML += `<div class="pagination-info">Показано ${startItem}-${endItem} з ${totalItems} записів</div>`;

    return paginationHTML;
}
function changePage(pageNum, pageType) {
    switch (pageType) {
        case 'appointments':
            currentAppointmentsPage = pageNum;
            renderAppointments();
            break;
        case 'services':
            currentServicesPage = pageNum;
            renderServices();
            break;
        case 'inventory':
            currentInventoryPage = pageNum;
            renderInventory();
            break;
        case 'dispensed':
            currentDispensedPage = pageNum;
            renderDispensedItems();
            break;
        case 'report':
            currentReportPage = pageNum;
            generateReport();
            break;
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
}

function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2) + ' грн';
}