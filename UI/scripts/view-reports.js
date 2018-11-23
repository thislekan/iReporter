const divForEveryIncident = document.getElementById('all-reports');
const divForPendingIncidents = document.getElementById('pending-reports');
const divForResolvedIncidents = document.getElementById('resolved-reports');
const divForRejectedIncidents = document.getElementById('rejected-reports');
const divForUnderInvestigationIncidents = document.getElementById('under-investigation-reports');

const incidentIdentifier = document.getElementById('incident-title');
const sortIncidentByStatus = document.getElementById('sort-report');

function hideAllDivs() {
    divForEveryIncident.style.display = 'none';
    divForPendingIncidents.style.display = 'none';
    divForRejectedIncidents.style.display = 'none';
    divForResolvedIncidents.style.display = 'none';
    divForUnderInvestigationIncidents.style.display = 'none';
}


sortIncidentByStatus.addEventListener('change', () => {
    hideAllDivs();
    switch (sortIncidentByStatus.value) {
        case 'all':
            incidentIdentifier.innerText = 'All reported incidents';
            divForEveryIncident.style.display = 'block';
            break;
        case 'pending':
            incidentIdentifier.innerText = 'All pending incidents';
            divForPendingIncidents.style.display = 'block';
            break;
        case 'resolved':
            incidentIdentifier.innerText = 'All resolved incidents';
            divForResolvedIncidents.style.display = 'block';
            break;
        case 'rejected':
            incidentIdentifier.innerText = 'All rejected incidents';
            divForRejectedIncidents.style.display = 'block';
            break;
        case 'under-investigation':
            incidentIdentifier.innerText = 'All incidents under investigation';
            divForUnderInvestigationIncidents.style.display = 'block';
            break;
        default:
            break;
    }
    // console.log(incidentIdentifier)
});

window.onload = () => {
    // console.log('ready')
    hideAllDivs();
    divForEveryIncident.style.display = 'block';
}