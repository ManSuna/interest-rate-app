<div style="margin-bottom: 25px;">
    <div id="cycleStatisticsGrid"></div>
</div>

<div>
    <div id="connectivityStatusGrid"></div>
</div>


$(document).ready(function () {
    loadCycleStatisticsGrid();
    loadConnectivityStatusGrid();
});

function loadCycleStatisticsGrid() {
    $.ajax({
        url: "/yourController/getCycleStatistics",
        type: "GET",
        success: function (response) {
            $("#cycleStatisticsGrid").kendoGrid({
                dataSource: {
                    data: response.rows
                },
                scrollable: false,
                sortable: false,
                pageable: false,
                noRecords: {
                    template: "No cycle statistics found"
                },
                columns: [
                    {
                        field: "source",
                        title: "Fed Current Cycle<br/>" + (response.cycleDate || ""),
                        encoded: false,
                        width: 220
                    },
                    {
                        field: "topUps",
                        title: "Top-Ups",
                        width: 100
                    },
                    {
                        field: "drawdowns",
                        title: "Drawdowns",
                        width: 110
                    },
                    {
                        field: "admi006",
                        title: "admi.006",
                        width: 100
                    },
                    {
                        field: "camt052",
                        title: "Report Messages<br/>(CAMT.052)",
                        encoded: false,
                        width: 160
                    },
                    {
                        field: "admi002",
                        title: "admi.002<br/>(Rejections)",
                        encoded: false,
                        width: 140
                    },
                    {
                        field: "pacs002",
                        title: "PACS.002",
                        width: 100
                    }
                ]
            });
        },
        error: function () {
            console.error("Failed to load cycle statistics");
        }
    });
}

function loadConnectivityStatusGrid() {
    $.ajax({
        url: "/yourController/getConnectivityStatuses",
        type: "GET",
        success: function (response) {
            $("#connectivityStatusGrid").kendoGrid({
                dataSource: {
                    data: response
                },
                scrollable: false,
                sortable: false,
                pageable: false,
                noRecords: {
                    template: "No status records found"
                },
                columns: [
                    {
                        field: "statusName",
                        title: "Status",
                        width: 300
                    },
                    {
                        field: "status",
                        title: "Condition",
                        width: 150,
                        template: function (dataItem) {
                            if (dataItem.status === "GREEN") {
                                return '<span style="color: green; font-weight: bold;">Green</span>';
                            }
                            if (dataItem.status === "RED") {
                                return '<span style="color: red; font-weight: bold;">Red</span>';
                            }
                            return dataItem.status ? dataItem.status : "";
                        }
                    }
                ]
            });
        },
        error: function () {
            console.error("Failed to load connectivity statuses");
        }
    });
}
