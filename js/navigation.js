document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-links li');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    document.querySelectorAll('.quick-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            navLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            const navLink = document.querySelector(`.nav-links li[data-tab="${tabId}"]`);
            if (navLink) navLink.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

function setupModalCloseHandlers() {
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupModalCloseHandlers);