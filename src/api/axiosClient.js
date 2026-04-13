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
