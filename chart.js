import charts from "./utils/charts/headCharts.js"

(async() => {

    // console.log(await chart724.getTopTeamsIncidentStatus());
    // console.log(await chart724.getAlertIncidentCountOnDate());
    // console.log(await chart724.getOpenAlertsIncidentsCount());

    console.log(await charts.getIncidentCounts(31));
    console.log(await charts.getTopUsersIncidentStatus(31));
    console.log(await charts.totalIncidents(31));
    
    
    
})()