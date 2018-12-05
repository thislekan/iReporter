const reportTypeSelection = document.getElementById('report-type');
const interventionsContainer = document.getElementById('intervention-div');
const redFlagsContainer = document.getElementById('red-flag-div');
const logoutButton = document.getElementById('log-out');

reportTypeSelection.addEventListener('change', () => {
    const selectedReport = reportTypeSelection.value;
    switch (selectedReport) {
        case 'red-flag':
            redFlagsContainer.style.display = 'block';
            interventionsContainer.style.display = 'none';
            break;
        case 'intervention':
            redFlagsContainer.style.display = 'none';
            interventionsContainer.style.display = 'block';
        default:
            break;
    }
});

logoutButton.addEventListener('click', () => location.href = '../../../index.html');