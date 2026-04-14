function updateStatus(source, isAlive) {
    const idMap = {
        FEDWIRE: "fedwireStatus",
        FEDNOW: "fednowStatus",
        RTPS: "rtpsStatus"
    };

    const el = $("#" + idMap[source]);
    el.html(isAlive ? "🟢" : "🔴");
}


<span id="fedwireStatus"></span>
<span id="fednowStatus"></span>
<span id="rtpsStatus"></span>



function sendHeartbeatRequest() {
    console.log("Sending XHR Request: " + getHeartbeatRequestXhrURL);

    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: getHeartbeatRequestXhrURL,
        success: function(response) {
            updateSystemStatus('FEDWIRE', response.fedwireAlive);
            updateSystemStatus('FEDNOW', response.fedNowAlive);
            updateSystemStatus('RTPS', response.rtpsAlive);
        },
        error: function(e) {
            if (e.responseJSON && e.responseJSON.errorMessage) {
                initializeServerErrorWindow(e.responseJSON.errorMessage);
            } else {
                console.log("Heartbeat request failed.");
            }
        }
    });
}

function updateSystemStatus(source, isAlive) {
    updateFooterStatus(source, isAlive);
    updateTableStatus(source, isAlive);
}

function updateFooterStatus(source, isAlive) {
    var unavailableSelector = '';
    var aliveSelector = '';

    switch (source) {
        case 'FEDWIRE':
            unavailableSelector = '.ffsUnavailable';
            aliveSelector = '.ffsAlive';
            break;
        case 'FEDNOW':
            unavailableSelector = '.fedNowUnavailable';
            aliveSelector = '.fedNowAlive';
            break;
        case 'RTPS':
            unavailableSelector = '.ipsUnavailable';
            aliveSelector = '.ipsAlive';
            break;
        default:
            return;
    }

    $(unavailableSelector).hide();
    $(aliveSelector).hide();

    if (isAlive) {
        $(aliveSelector).show();
    } else {
        $(unavailableSelector).show();
    }
}

function updateTableStatus(source, isAlive) {
    var elementId = '';

    switch (source) {
        case 'FEDWIRE':
            elementId = 'fedwireStatus';
            break;
        case 'FEDNOW':
            elementId = 'fednowStatus';
            break;
        case 'RTPS':
            elementId = 'rtpsStatus';
            break;
        default:
            return;
    }

    var $cell = $('#' + elementId);

    // Table exists only on one page, so safely skip on others
    if ($cell.length === 0) {
        return;
    }

    if (isAlive) {
        $cell.html("<img src='/FedwireConsole/resources/images/alive.png' alt='Alive' />");
    } else {
        $cell.html("<img src='/FedwireConsole/resources/images/unavailable.png' alt='Unavailable' />");
    }
}


.ffsUnavailable,
.ffsAlive,
.fedNowUnavailable,
.fedNowAlive,
.ipsUnavailable,
.ipsAlive {
    display: none;
}



