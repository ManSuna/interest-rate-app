@Service
public class DashboardStatisticsServiceImpl implements DashboardStatisticsService {

    private final DashboardStatisticsDao dashboardStatisticsDao;

    public DashboardStatisticsServiceImpl(DashboardStatisticsDao dashboardStatisticsDao) {
        this.dashboardStatisticsDao = dashboardStatisticsDao;
    }

    @Override
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        String currentCycleDate = dashboardStatisticsDao.getCurrentCycleDate();
        List<CurrentCycleStatisticsRow> rows = dashboardStatisticsDao.getCurrentCycleStatisticsRows();

        CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
        response.setCycleDate(currentCycleDate);
        response.setRows(rows);
        return response;
    }

    @Override
    public List<ConnectivityStatusRow> getConnectivityStatuses() {
        return dashboardStatisticsDao.getConnectivityStatuses();
    }
}


import java.util.List;

public class CurrentCycleStatisticsResponse {

    private String cycleDate;
    private List<CurrentCycleStatisticsRow> rows;

    public String getCycleDate() {
        return cycleDate;
    }

    public void setCycleDate(String cycleDate) {
        this.cycleDate = cycleDate;
    }

    public List<CurrentCycleStatisticsRow> getRows() {
        return rows;
    }

    public void setRows(List<CurrentCycleStatisticsRow> rows) {
        this.rows = rows;
    }
}

public class CurrentCycleStatisticsRow {

    private String source;
    private Integer topUps;
    private Integer drawdowns;
    private Integer admi006;
    private Integer camt052;
    private Integer admi002;
    private Integer pacs002;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Integer getTopUps() {
        return topUps;
    }

    public void setTopUps(Integer topUps) {
        this.topUps = topUps;
    }

    public Integer getDrawdowns() {
        return drawdowns;
    }

    public void setDrawdowns(Integer drawdowns) {
        this.drawdowns = drawdowns;
    }

    public Integer getAdmi006() {
        return admi006;
    }

    public void setAdmi006(Integer admi006) {
        this.admi006 = admi006;
    }

    public Integer getCamt052() {
        return camt052;
    }

    public void setCamt052(Integer camt052) {
        this.camt052 = camt052;
    }

    public Integer getAdmi002() {
        return admi002;
    }

    public void setAdmi002(Integer admi002) {
        this.admi002 = admi002;
    }

    public Integer getPacs002() {
        return pacs002;
    }

    public void setPacs002(Integer pacs002) {
        this.pacs002 = pacs002;
    }
}


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
