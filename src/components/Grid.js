

Skip to content
Using Gmail with screen readers
1 of 2,176
(no subject)
Inbox

Sunil Gurung <linusgnurug@gmail.com>
8:44 AM (0 minutes ago)
to me

<div class="system-stats-panel">
<div class="system-stats-title">
Fed Current Cycle Date Statistics
</div>

<table id="systemStatisticsTable" class="system-stats-table">
<tbody>
<tr>
<td class="label-cell">Fed Current Cycle</td>
<td id="cycleDateCell">--</td>
<td></td><td></td><td></td><td></td><td></td>
</tr>

<tr class="header-row">
<td>Source</td>
<td>Top-Ups</td>
<td>Drawdowns</td>
<td>admi.006</td>
<td>Report Messages<br>(CAMT.052)</td>
<td>admi.002<br>(Rejections)</td>
<td>PACS.002</td>
</tr>

<tr>
<td>Fedwire</td>
<td id="fwTopUps">0</td>
<td id="fwDrawdowns">0</td>
<td id="fwAdmi006">0</td>
<td id="fwCamt052">0</td>
<td id="fwAdmi002">0</td>
<td id="fwPacs002">0</td>
</tr>

<tr>
<td>FedNow</td>
<td id="fnTopUps">0</td>
<td id="fnDrawdowns">0</td>
<td id="fnAdmi006">0</td>
<td id="fnCamt052">0</td>
<td id="fnAdmi002">0</td>
<td id="fnPacs002">0</td>
</tr>

<tr class="section-header">
<td colspan="7">Connectivity</td>
</tr>

<tr class="header-row">
<td></td>
<td>Fedwire</td>
<td>FedNow</td>
<td>TCH RTP</td>
<td colspan="3"></td>
</tr>

<tr>
<td>Status</td>
<td id="fwStatus">-</td>
<td id="fnStatus">-</td>
<td id="rtpStatus">-</td>
<td colspan="3"></td>
</tr>
</tbody>
</table>
</div>

.system-stats-panel {
border: 1px solid #bfc9d4;
background: #fff;
margin-top: 10px;
}

.system-stats-title {
padding: 10px 12px;
font-weight: bold;
font-size: 16px;
border-bottom: 1px solid #bfc9d4;
background: linear-gradient(#eef5f8, #dbe8ee);
}

.system-stats-table {
width: 100%;
border-collapse: collapse;
table-layout: fixed;
}

.system-stats-table td {
border: 1px solid #d5dde5;
padding: 8px;
font-size: 13px;
text-align: center;
}

.system-stats-table .label-cell {
font-weight: bold;
text-align: left;
}

.header-row td {
background: #eef3f6;
font-weight: 500;
}

.section-header td {
background: #eef3f6;
font-weight: bold;
text-align: left;
padding: 10px;
border-top: 2px solid #cfd8dc;
}

.status-green {
color: #2e7d32;
font-weight: bold;
}

.status-red {
color: #c62828;
font-weight: bold;
}



var getSystemStatisticsXhrURL = getBaseUrl() + "/api/dashboard/getSystemStatistics";
var getConnectivityStatusXhrURL = getBaseUrl() + "/api/dashboard/getConnectivityStatus";


 
function loadCycleStatisticsTable() {
$.ajax({
type: "GET",
dataType: "json",
contentType: "application/json",
url: getSystemStatisticsXhrURL,
success: function(response) {
$("#cycleDateCell").text(response.cycleDate || "--");

$("#fwTopUps").text(response.fedwireTopUps || 0);
$("#fwDrawdowns").text(response.fedwireDrawdowns || 0);
$("#fwAdmi006").text(response.fedwireAdmi006 || 0);
$("#fwCamt052").text(response.fedwireCamt052 || 0);
$("#fwAdmi002").text(response.fedwireAdmi002 || 0);
$("#fwPacs002").text(response.fedwirePacs002 || 0);

$("#fnTopUps").text(response.fednowTopUps || 0);
$("#fnDrawdowns").text(response.fednowDrawdowns || 0);
$("#fnAdmi006").text(response.fednowAdmi006 || 0);
$("#fnCamt052").text(response.fednowCamt052 || 0);
$("#fnAdmi002").text(response.fednowAdmi002 || 0);
$("#fnPacs002").text(response.fednowPacs002 || 0);
},
error: function(e) {
console.log("Unable to load cycle statistics", e);
initializeServerErrorWindow(e);
}
});
}


function loadConnectivityStatuses() {
$.ajax({
type: "GET",
dataType: "json",
contentType: "application/json",
url: getConnectivityStatusXhrURL,
success: function(response) {
setStatus("fwStatus", response.fedwireConnectivityStatus);
setStatus("fnStatus", response.fednowConnectivityStatus);
setStatus("rtpStatus", response.tchFedInterfaceStatus);
},
error: function(e) {
console.log("Unable to load connectivity statuses", e);
initializeServerErrorWindow(e);
}
});
}


function setStatus(id, status) {
var el = $("#" + id);
el.removeClass("status-green status-red");

if (status === "GREEN") {
el.text("Green");
el.addClass("status-green");
} else if (status === "RED") {
el.text("Red");
el.addClass("status-red");
} else {
el.text("-");
}
}


$(document).ready(function() {
loadCycleStatisticsTable();
loadConnectivityStatuses();
});


