

How to remove this unknown ?

I need a bit more context to give you the exact fix—“unknown” could mean a few different things depending on where you’re seeing it.

Can you quickly tell me (or re-upload a screenshot):

Where is the “unknown” showing up? (UI screen, DB value, JSON response, logs, etc.)

What tech is involved? (Spring Boot, Kendo UI, DB2, etc.)

Is it coming from backend or frontend?

In the meantime, here are the most common causes + fixes 👇
1. Frontend (Kendo / UI) showing “unknown”
Usually happens when value is null or not mapped.

Fix:

value ? value : ""
or in Kendo template:

#= field ? field : '' #
2. Backend (Spring Boot) returning “unknown”
Often due to default value or enum fallback.

Check:

return value != null ? value : "";
If enum:

Enum.valueOf(...) // might default to UNKNOWN
3. Database returning “UNKNOWN”
Sometimes data actually stored as 'UNKNOWN'.

Fix query:

SELECT 
  CASE 
    WHEN column = 'UNKNOWN' THEN ''
    ELSE column 
  END
FROM table;
4. JSON mapping issue
If field not mapped properly → shows as unknown.

Check DTO:

@JsonProperty("correctName")
private String field;
5. Switch / logic fallback
You might have something like:

default -> "UNKNOWN";
Change to:

default -> "";
If you send me the screenshot (I think you had one earlier), I’ll give you exact line-by-line fix—no guessing 👍


Uploaded image

Got it 👍 — I can see exactly where your UNKNOWN is coming from.

🔍 Problem line:
report.setType(24 == dispositionCode ? CREDIT :
               68 == dispositionCode ? DEBIT :
               UNKNOWN);
👉 That last UNKNOWN is your fallback.
So whenever dispositionCode is NOT 24 or 68 → it becomes "UNKNOWN".

✅ How to remove it
✅ Option 1: Just make it empty (most common)
report.setType(24 == dispositionCode ? CREDIT :
               68 == dispositionCode ? DEBIT :
               "");
✅ Option 2: Skip setting type if not matched (cleaner)
if (dispositionCode == 24) {
    report.setType(CREDIT);
} else if (dispositionCode == 68) {
    report.setType(DEBIT);
}
👉 This way:

No "UNKNOWN"

Field stays null if not matched

✅ Option 3: Use Optional-style fallback (clean + safe)
String type = null;
if (dispositionCode == 24) type = CREDIT;
else if (dispositionCode == 68) type = DEBIT;

report.setType(type);
💡 Best Practice (for your case)
Since you're dealing with payment data:

👉 I’d recommend Option 2 (if/else)

Easier to read

No hidden fallback

Matches business logic clearly

⚠️ One more thing to check
If you're still seeing "UNKNOWN" after removing it here:

Check if UNKNOWN is defined as a constant somewhere

Or if UI is defaulting null → "UNKNOWN"

If you want, I can help you refactor this whole block (it’s a bit messy with nested ternary 😄).


Uploaded image
Uploaded image
Uploaded image
Change it to this using kendo grid 

Yes — for that layout, use a Kendo Grid instead of the plain <table>.

Your current HTML is just a static label/value table, but the target UI is really a row/column summary grid like this:

first column = Source / Status

other columns = Top-Ups, Drawdowns, admi.006, CAMT.052, admi.002, PACS.002

Here is a clean way to change it.

Kendo Grid example
HTML
<div id="cycleStatsGrid"></div>

What is this?
JavaScript
$(document).ready(function () {
    const cycleDate = "03/11/16";

    const gridData = [
        {
            rowType: "transaction",
            source: "Fedwire",
            topUps: 2,
            drawdowns: 4,
            admi006: 4,
            camt052: 0,
            admi002: 0,
            pacs002: 0
        },
        {
            rowType: "transaction",
            source: "FedNow",
            topUps: 4,
            drawdowns: 0,
            admi006: 6,
            camt052: 1,
            admi002: 2,
            pacs002: 1
        },
        {
            rowType: "status",
            source: "Fedwire Connectivity",
            topUps: "",
            drawdowns: "",
            admi006: "Green",
            camt052: "",
            admi002: "",
            pacs002: ""
        },
        {
            rowType: "status",
            source: "FedNow Connectivity",
            topUps: "",
            drawdowns: "",
            admi006: "Green",
            camt052: "",
            admi002: "",
            pacs002: ""
        },
        {
            rowType: "status",
            source: "TCH Fed Interface to RTP",
            topUps: "",
            drawdowns: "",
            admi006: "Red",
            camt052: "",
            admi002: "",
            pacs002: ""
        }
    ];

    $("#cycleStatsGrid").kendoGrid({
        dataSource: {
            data: gridData,
            schema: {
                model: {
                    fields: {
                        source: { type: "string" },
                        topUps: { type: "string" },
                        drawdowns: { type: "string" },
                        admi006: { type: "string" },
                        camt052: { type: "string" },
                        admi002: { type: "string" },
                        pacs002: { type: "string" }
                    }
                }
            }
        },
        sortable: false,
        pageable: false,
        scrollable: false,
        editable: false,
        columns: [
            {
                field: "source",
                title: "Fed Current Cycle<br/>" + cycleDate,
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
                width: 100,
                template: function(dataItem) {
                    return renderStatusCell(dataItem.admi006);
                }
            },
            {
                field: "camt052",
                title: "Report Messages<br/>(CAMT.052)",
                encoded: false,
                width: 150
            },
            {
                field: "admi002",
                title: "admi.002<br/>(Rejections)",
                encoded: false,
                width: 130
            },
            {
                field: "pacs002",
                title: "PACS.002",
                width: 100
            }
        ]
    });

    function renderStatusCell(value) {
        if (value === "Green") {
            return '<span style="color:green;font-weight:bold;">Green</span>';
        }
        if (value === "Red") {
            return '<span style="color:red;font-weight:bold;">Red</span>';
        }
        return value == null ? "" : value;
    }
});
If you want grouped section labels like the screenshot
If you want a row saying Status before the connectivity rows, add one more row:

{
    rowType: "section",
    source: "Status",
    topUps: "",
    drawdowns: "",
    admi006: "",
    camt052: "",
    admi002: "",
    pacs002: ""
}
Then style it with rowTemplate.

Better version with row styling
$("#cycleStatsGrid").kendoGrid({
    dataSource: {
        data: gridData
    },
    scrollable: false,
    pageable: false,
    rowTemplate: function(dataItem) {
        let rowClass = "";
        if (dataItem.rowType === "section") {
            rowClass = "section-row";
        }

        return `
            <tr class="${rowClass}">
                <td>${dataItem.source || ""}</td>
                <td>${dataItem.topUps || ""}</td>
                <td>${dataItem.drawdowns || ""}</td>
                <td>${renderStatusCell(dataItem.admi006)}</td>
                <td>${dataItem.camt052 || ""}</td>
                <td>${dataItem.admi002 || ""}</td>
                <td>${dataItem.pacs002 || ""}</td>
            </tr>
        `;
    },
    columns: [
        { field: "source", title: "Fed Current Cycle<br/>03/11/16", encoded: false },
        { field: "topUps", title: "Top-Ups" },
        { field: "drawdowns", title: "Drawdowns" },
        { field: "admi006", title: "admi.006" },
        { field: "camt052", title: "Report Messages<br/>(CAMT.052)", encoded: false },
        { field: "admi002", title: "admi.002<br/>(Rejections)", encoded: false },
        { field: "pacs002", title: "PACS.002" }
    ]
});
CSS
.section-row td {
    font-weight: bold;
    background: #f5f5f5;
}
Your current code issue
Right now you have:

<td style="text-align: left; padding-left: 10px;" id="currentCycleDate">
</td>

What is this?
That cell is empty unless you set it in JavaScript.

That is why your current screen shows only labels and zeros in a plain block format.

Recommended approach
Instead of this old structure:

<div id="systemStat-left">
    <table>...</table>
</div>

What is this?
replace it with:

<div id="cycleStatsGrid"></div>

What is this?
and bind your backend response into the Kendo Grid data source.

If data comes from backend
Example:

$.ajax({
    url: "/yourController/getCycleStats",
    type: "GET",
    success: function(response) {
        $("#cycleStatsGrid").kendoGrid({
            dataSource: {
                data: response
            },
            pageable: false,
            scrollable: false,
            columns: [
                { field: "source", title: "Fed Current Cycle<br/>" + response.cycleDate, encoded: false },
                { field: "topUps", title: "Top-Ups" },
                { field: "drawdowns", title: "Drawdowns" },
                { field: "admi006", title: "admi.006" },
                { field: "camt052", title: "Report Messages<br/>(CAMT.052)", encoded: false },
                { field: "admi002", title: "admi.002<br/>(Rejections)", encoded: false },
                { field: "pacs002", title: "PACS.002" }
            ]
        });
    }
});
Best final structure for you
Use 2 grids or 1 combined grid:

one row section for Fedwire / FedNow counts

another row section for status rows

That will match the mock much better than label/value pairs.

Send me your current JS that fills:

currentCycleDate

numOfMessagesInAdvice

numOfMessagesInAcks

numOfMessagesInBroadcast

numOfMessagesInIpsIn

numberOfActionNeededMessages

and I’ll convert your exact existing code into a full Kendo Grid version.


Lets do two grids, I can do two separate backend calls and get the dataa

Yes — two grids is the better design here.

That keeps it simple:

Grid 1 = message counts by source

Grid 2 = connectivity / status rows

It will also make your backend cleaner since you can return two separate response objects.

Suggested layout
Grid 1: Current Cycle Statistics
Columns:

Source

Top-Ups

Drawdowns

admi.006

Report Messages (CAMT.052)

admi.002 (Rejections)

PACS.002

Rows:

Fedwire

FedNow

Grid 2: Status
Columns:

Status Item

Status

Rows:

Fedwire Connectivity

FedNow Connectivity

TCH Fed Interface to RTP

Frontend
HTML
<div style="margin-bottom: 25px;">
    <div id="cycleStatisticsGrid"></div>
</div>

<div>
    <div id="connectivityStatusGrid"></div>
</div>

What is this?
JavaScript
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
Example backend responses
Backend call 1
/yourController/getCycleStatistics
{
  "cycleDate": "03/11/16",
  "rows": [
    {
      "source": "Fedwire",
      "topUps": 2,
      "drawdowns": 4,
      "admi006": 4,
      "camt052": 0,
      "admi002": 0,
      "pacs002": 0
    },
    {
      "source": "FedNow",
      "topUps": 4,
      "drawdowns": 0,
      "admi006": 6,
      "camt052": 1,
      "admi002": 2,
      "pacs002": 1
    }
  ]
}
Backend call 2
/yourController/getConnectivityStatuses
[
  {
    "statusName": "Fedwire Connectivity",
    "status": "GREEN"
  },
  {
    "statusName": "FedNow Connectivity",
    "status": "GREEN"
  },
  {
    "statusName": "TCH Fed Interface to RTP",
    "status": "RED"
  }
]
Java backend DTOs
Cycle statistics response
public class CycleStatisticsResponse {
    private String cycleDate;
    private List<CycleStatisticsRow> rows;

    public String getCycleDate() {
        return cycleDate;
    }

    public void setCycleDate(String cycleDate) {
        this.cycleDate = cycleDate;
    }

    public List<CycleStatisticsRow> getRows() {
        return rows;
    }

    public void setRows(List<CycleStatisticsRow> rows) {
        this.rows = rows;
    }
}
Cycle statistics row
public class CycleStatisticsRow {
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
Connectivity status row
public class ConnectivityStatusRow {
    private String statusName;
    private String status;

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
Sample controller
@RestController
@RequestMapping("/yourController")
public class StatisticsController {

    @GetMapping("/getCycleStatistics")
    public CycleStatisticsResponse getCycleStatistics() {
        CycleStatisticsResponse response = new CycleStatisticsResponse();
        response.setCycleDate("03/11/16");

        List<CycleStatisticsRow> rows = new ArrayList<>();

        CycleStatisticsRow fedwire = new CycleStatisticsRow();
        fedwire.setSource("Fedwire");
        fedwire.setTopUps(2);
        fedwire.setDrawdowns(4);
        fedwire.setAdmi006(4);
        fedwire.setCamt052(0);
        fedwire.setAdmi002(0);
        fedwire.setPacs002(0);

        CycleStatisticsRow fedNow = new CycleStatisticsRow();
        fedNow.setSource("FedNow");
        fedNow.setTopUps(4);
        fedNow.setDrawdowns(0);
        fedNow.setAdmi006(6);
        fedNow.setCamt052(1);
        fedNow.setAdmi002(2);
        fedNow.setPacs002(1);

        rows.add(fedwire);
        rows.add(fedNow);

        response.setRows(rows);
        return response;
    }

    @GetMapping("/getConnectivityStatuses")
    public List<ConnectivityStatusRow> getConnectivityStatuses() {
        List<ConnectivityStatusRow> rows = new ArrayList<>();

        ConnectivityStatusRow row1 = new ConnectivityStatusRow();
        row1.setStatusName("Fedwire Connectivity");
        row1.setStatus("GREEN");

        ConnectivityStatusRow row2 = new ConnectivityStatusRow();
        row2.setStatusName("FedNow Connectivity");
        row2.setStatus("GREEN");

        ConnectivityStatusRow row3 = new ConnectivityStatusRow();
        row3.setStatusName("TCH Fed Interface to RTP");
        row3.setStatus("RED");

        rows.add(row1);
        rows.add(row2);
        rows.add(row3);

        return rows;
    }
}
Optional CSS to make it look better
.k-grid {
    font-size: 14px;
}

.k-grid-header th {
    font-weight: bold;
    text-align: center;
}

.k-grid td {
    text-align: center;
}

.k-grid td:first-child {
    text-align: left;
}
My recommendation
For your case:

Grid 1 for counts

Grid 2 for statuses

Keep backend separate

Much easier to maintain than one mixed grid

The next clean step is for me to give you:
exact JSP/HTML + JS + Spring Boot controller code using your current field names like numOfMessagesInAdvice, numOfMessagesInAcks, etc.


How would the backend and model looks like? 

A clean way is to keep two separate models and two separate endpoints.

That gives you:

one response for the message count grid

one response for the status grid

1. Backend model for Grid 1
Message count grid
This is the grid with columns like:

Source

Top-Ups

Drawdowns

admi.006

CAMT.052

admi.002

PACS.002

Row model
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
Wrapper response model
You need the cycle date too, because your first grid header shows the cycle date.

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
2. Backend model for Grid 2
Connectivity/status grid
This is the simple one:

Status Name

Status

Row model
public class ConnectivityStatusRow {

    private String statusName;
    private String status;

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
3. Optional better status model
Instead of sending just "GREEN" or "RED", I would send both:

display text

code

That helps later if UI changes.

public class ConnectivityStatusRow {

    private String statusName;
    private String statusCode;
    private String statusLabel;

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }
}
Example:

statusCode = "GREEN"

statusLabel = "Green"

This is a little cleaner than making UI guess.

4. Service layer example
Service interface
import java.util.List;

public interface DashboardStatisticsService {

    CurrentCycleStatisticsResponse getCurrentCycleStatistics();

    List<ConnectivityStatusRow> getConnectivityStatuses();
}
Service implementation
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardStatisticsServiceImpl implements DashboardStatisticsService {

    @Override
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
        response.setCycleDate("03/11/16");

        List<CurrentCycleStatisticsRow> rows = new ArrayList<>();

        CurrentCycleStatisticsRow fedwire = new CurrentCycleStatisticsRow();
        fedwire.setSource("Fedwire");
        fedwire.setTopUps(2);
        fedwire.setDrawdowns(4);
        fedwire.setAdmi006(4);
        fedwire.setCamt052(0);
        fedwire.setAdmi002(0);
        fedwire.setPacs002(0);

        CurrentCycleStatisticsRow fedNow = new CurrentCycleStatisticsRow();
        fedNow.setSource("FedNow");
        fedNow.setTopUps(4);
        fedNow.setDrawdowns(0);
        fedNow.setAdmi006(6);
        fedNow.setCamt052(1);
        fedNow.setAdmi002(2);
        fedNow.setPacs002(1);

        rows.add(fedwire);
        rows.add(fedNow);

        response.setRows(rows);
        return response;
    }

    @Override
    public List<ConnectivityStatusRow> getConnectivityStatuses() {
        List<ConnectivityStatusRow> rows = new ArrayList<>();

        ConnectivityStatusRow fedwire = new ConnectivityStatusRow();
        fedwire.setStatusName("Fedwire Connectivity");
        fedwire.setStatus("GREEN");

        ConnectivityStatusRow fedNow = new ConnectivityStatusRow();
        fedNow.setStatusName("FedNow Connectivity");
        fedNow.setStatus("GREEN");

        ConnectivityStatusRow tch = new ConnectivityStatusRow();
        tch.setStatusName("TCH Fed Interface to RTP");
        tch.setStatus("RED");

        rows.add(fedwire);
        rows.add(fedNow);
        rows.add(tch);

        return rows;
    }
}
5. Controller
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardStatisticsController {

    private final DashboardStatisticsService dashboardStatisticsService;

    public DashboardStatisticsController(DashboardStatisticsService dashboardStatisticsService) {
        this.dashboardStatisticsService = dashboardStatisticsService;
    }

    @GetMapping("/current-cycle-statistics")
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        return dashboardStatisticsService.getCurrentCycleStatistics();
    }

    @GetMapping("/connectivity-statuses")
    public List<ConnectivityStatusRow> getConnectivityStatuses() {
        return dashboardStatisticsService.getConnectivityStatuses();
    }
}
6. Example JSON returned
Endpoint 1
/dashboard/current-cycle-statistics
{
  "cycleDate": "03/11/16",
  "rows": [
    {
      "source": "Fedwire",
      "topUps": 2,
      "drawdowns": 4,
      "admi006": 4,
      "camt052": 0,
      "admi002": 0,
      "pacs002": 0
    },
    {
      "source": "FedNow",
      "topUps": 4,
      "drawdowns": 0,
      "admi006": 6,
      "camt052": 1,
      "admi002": 2,
      "pacs002": 1
    }
  ]
}
Endpoint 2
/dashboard/connectivity-statuses
[
  {
    "statusName": "Fedwire Connectivity",
    "status": "GREEN"
  },
  {
    "statusName": "FedNow Connectivity",
    "status": "GREEN"
  },
  {
    "statusName": "TCH Fed Interface to RTP",
    "status": "RED"
  }
]
7. If your data comes from DAO
Your service would probably look more like this:

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
8. If you want enums for status
This is even better than raw strings.

public enum ConnectivityStatus {
    GREEN,
    RED
}
Then model:

public class ConnectivityStatusRow {

    private String statusName;
    private ConnectivityStatus status;

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public ConnectivityStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectivityStatus status) {
        this.status = status;
    }
}
That avoids typos like "Green" vs "GREEN".

9. My recommendation for you
For your project, I would use exactly this:

Models
CurrentCycleStatisticsResponse

CurrentCycleStatisticsRow

ConnectivityStatusRow

Endpoints
/dashboard/current-cycle-statistics

/dashboard/connectivity-statuses

Status values
use GREEN / RED

let UI decide color

10. Very practical simplified version
If you do not want many files, the minimum is:

one response class for grid 1

one row class for grid 1

one row class for grid 2

That is enough.

If you want, next I can give you the DAO + SQL query shape for both backend calls.


For Grid 1, These are records based on message types in a receivedmessage table. I need to do a select > than createTimestamp . How do I implement it best? 

Best way is:

query received_message once for the time window

group by source + message type

return counts already shaped for Grid 1

avoid doing many separate count queries if you can

If Grid 1 is based on records where create_timestamp > someTimestamp, then your backend should look like:

determine the lower-bound timestamp

run one aggregate query

map the results into two rows: Fedwire and FedNow

Best design
Input to DAO/service
Pass one timestamp:

Timestamp fromCreateTimestamp
Then query:

where create_timestamp > :fromCreateTimestamp
You may also want < now() or < toTimestamp if needed.

Recommended DB approach
Instead of doing this:

count Top-Ups separately

count Drawdowns separately

count admi.006 separately

count CAMT.052 separately

count admi.002 separately

count PACS.002 separately

repeat for Fedwire/FedNow

that becomes messy fast.

Do one grouped query.

Example table assumption
Let’s say received_message has columns like:

source_system or something telling you Fedwire / FedNow

message_type

create_timestamp

Then query like this:

SELECT
    source_system,
    message_type,
    COUNT(*) AS total_count
FROM received_message
WHERE create_timestamp > ?
GROUP BY source_system, message_type
If you also need upper bound:

SELECT
    source_system,
    message_type,
    COUNT(*) AS total_count
FROM received_message
WHERE create_timestamp > ?
  AND create_timestamp <= ?
GROUP BY source_system, message_type
Then map in Java
Model for raw query result
public class MessageTypeCount {

    private String source;
    private String messageType;
    private Integer count;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
Grid 1 row model
public class CurrentCycleStatisticsRow {

    private String source;
    private Integer topUps = 0;
    private Integer drawdowns = 0;
    private Integer admi006 = 0;
    private Integer camt052 = 0;
    private Integer admi002 = 0;
    private Integer pacs002 = 0;

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
DAO example
JdbcTemplate version
@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;

    public ReceivedMessageDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<MessageTypeCount> getMessageCountsAfter(Timestamp fromCreateTimestamp) {
        String sql = """
            SELECT
                source_system,
                message_type,
                COUNT(*) AS total_count
            FROM received_message
            WHERE create_timestamp > ?
            GROUP BY source_system, message_type
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            MessageTypeCount row = new MessageTypeCount();
            row.setSource(rs.getString("source_system"));
            row.setMessageType(rs.getString("message_type"));
            row.setCount(rs.getInt("total_count"));
            return row;
        }, fromCreateTimestamp);
    }
}
Service implementation
@Service
public class DashboardStatisticsServiceImpl implements DashboardStatisticsService {

    private final ReceivedMessageDao receivedMessageDao;

    public DashboardStatisticsServiceImpl(ReceivedMessageDao receivedMessageDao) {
        this.receivedMessageDao = receivedMessageDao;
    }

    @Override
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics(Timestamp fromCreateTimestamp, String cycleDate) {
        List<MessageTypeCount> counts = receivedMessageDao.getMessageCountsAfter(fromCreateTimestamp);

        CurrentCycleStatisticsRow fedwireRow = new CurrentCycleStatisticsRow();
        fedwireRow.setSource("Fedwire");

        CurrentCycleStatisticsRow fedNowRow = new CurrentCycleStatisticsRow();
        fedNowRow.setSource("FedNow");

        for (MessageTypeCount countRow : counts) {
            CurrentCycleStatisticsRow targetRow = getTargetRow(countRow.getSource(), fedwireRow, fedNowRow);
            if (targetRow == null) {
                continue;
            }

            mapCountToColumn(targetRow, countRow.getMessageType(), countRow.getCount());
        }

        CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
        response.setCycleDate(cycleDate);
        response.setRows(List.of(fedwireRow, fedNowRow));
        return response;
    }

    private CurrentCycleStatisticsRow getTargetRow(String source, CurrentCycleStatisticsRow fedwireRow,
            CurrentCycleStatisticsRow fedNowRow) {
        if ("Fedwire".equalsIgnoreCase(source)) {
            return fedwireRow;
        }
        if ("FedNow".equalsIgnoreCase(source)) {
            return fedNowRow;
        }
        return null;
    }

    private void mapCountToColumn(CurrentCycleStatisticsRow row, String messageType, Integer count) {
        if (messageType == null || count == null) {
            return;
        }

        switch (messageType) {
            case "TOP_UPS":
                row.setTopUps(count);
                break;
            case "DRAWDOWNS":
                row.setDrawdowns(count);
                break;
            case "ADMI_006":
                row.setAdmi006(count);
                break;
            case "CAMT_052":
                row.setCamt052(count);
                break;
            case "ADMI_002":
                row.setAdmi002(count);
                break;
            case "PACS_002":
                row.setPacs002(count);
                break;
            default:
                break;
        }
    }
}
Even better: use DB to pivot directly
If DB2 supports the syntax you want, you can do conditional aggregation and return the exact grid rows directly.

That is often the cleanest.

Example SQL
SELECT
    source_system AS source,
    SUM(CASE WHEN message_type = 'TOP_UPS' THEN 1 ELSE 0 END) AS top_ups,
    SUM(CASE WHEN message_type = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS drawdowns,
    SUM(CASE WHEN message_type = 'ADMI_006' THEN 1 ELSE 0 END) AS admi_006,
    SUM(CASE WHEN message_type = 'CAMT_052' THEN 1 ELSE 0 END) AS camt_052,
    SUM(CASE WHEN message_type = 'ADMI_002' THEN 1 ELSE 0 END) AS admi_002,
    SUM(CASE WHEN message_type = 'PACS_002' THEN 1 ELSE 0 END) AS pacs_002
FROM received_message
WHERE create_timestamp > ?
GROUP BY source_system
This is better than grouping by source_system, message_type because it already returns one row per source.

DAO for direct grid rows
@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;

    public ReceivedMessageDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CurrentCycleStatisticsRow> getCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
        String sql = """
            SELECT
                source_system AS source,
                SUM(CASE WHEN message_type = 'TOP_UPS' THEN 1 ELSE 0 END) AS top_ups,
                SUM(CASE WHEN message_type = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS drawdowns,
                SUM(CASE WHEN message_type = 'ADMI_006' THEN 1 ELSE 0 END) AS admi_006,
                SUM(CASE WHEN message_type = 'CAMT_052' THEN 1 ELSE 0 END) AS camt_052,
                SUM(CASE WHEN message_type = 'ADMI_002' THEN 1 ELSE 0 END) AS admi_002,
                SUM(CASE WHEN message_type = 'PACS_002' THEN 1 ELSE 0 END) AS pacs_002
            FROM received_message
            WHERE create_timestamp > ?
            GROUP BY source_system
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
            row.setSource(rs.getString("source"));
            row.setTopUps(rs.getInt("top_ups"));
            row.setDrawdowns(rs.getInt("drawdowns"));
            row.setAdmi006(rs.getInt("admi_006"));
            row.setCamt052(rs.getInt("camt_052"));
            row.setAdmi002(rs.getInt("admi_002"));
            row.setPacs002(rs.getInt("pacs_002"));
            return row;
        }, fromCreateTimestamp);
    }
}
This is probably the best implementation
Because then service is tiny:

@Override
public CurrentCycleStatisticsResponse getCurrentCycleStatistics(Timestamp fromCreateTimestamp, String cycleDate) {
    List<CurrentCycleStatisticsRow> rows = receivedMessageDao.getCurrentCycleStatisticsRows(fromCreateTimestamp);

    CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
    response.setCycleDate(cycleDate);
    response.setRows(rows);
    return response;
}
Important business question
You need to be clear on what fromCreateTimestamp means.

Examples:

current cycle start timestamp

previous closing timestamp

one day before current cycle at 7 PM

some system-calculated lower bound

That value should usually be calculated in service first, then passed into DAO.

Example
Timestamp fromCreateTimestamp = cycleWindowService.getCycleStartTimestamp(currentCycleDate);
List<CurrentCycleStatisticsRow> rows = receivedMessageDao.getCurrentCycleStatisticsRows(fromCreateTimestamp);
Best practice recommendation
Use this approach:
Service calculates fromCreateTimestamp

DAO runs one conditional aggregation query

Controller returns the wrapper response

That is the cleanest and fastest.

Final recommended shape
Controller
@GetMapping("/current-cycle-statistics")
public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
    return dashboardStatisticsService.getCurrentCycleStatistics();
}
Service
public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
    Timestamp fromCreateTimestamp = determineFromCreateTimestamp();
    String cycleDate = determineCycleDateDisplayValue();

    List<CurrentCycleStatisticsRow> rows =
            receivedMessageDao.getCurrentCycleStatisticsRows(fromCreateTimestamp);

    CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
    response.setCycleDate(cycleDate);
    response.setRows(rows);
    return response;
}
DAO
List<CurrentCycleStatisticsRow> getCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp)
If you want, I can write the exact DB2 SQL once you tell me your real column names for:

source column

message type column

create timestamp column

how Fedwire vs FedNow is identified


Its db2

Perfect — for DB2, the best way is still one aggregate query using SUM(CASE WHEN ...).

That is the cleanest for Grid 1.

Best pattern
You said:

data comes from received_message

filter by create_timestamp > ?

grid columns depend on message type

likely rows are Fedwire and FedNow

So the DB2 query should return one row per source and one count column per message type.

Recommended DB2 SQL
SELECT
    SOURCE_SYSTEM AS SOURCE,
    SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
    SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
    SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
    SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY SOURCE_SYSTEM
ORDER BY SOURCE_SYSTEM
This gives you output like:

SOURCE    TOP_UPS   DRAWDOWNS   ADMI_006   CAMT_052   ADMI_002   PACS_002
Fedwire   2         4           4          0          0          0
FedNow    4         0           6          1          2          1
That maps directly to your Kendo Grid.

Java model
Row model
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
Wrapper response
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
DAO example for DB2
Using JdbcTemplate:

@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;

    public ReceivedMessageDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CurrentCycleStatisticsRow> getCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
        String sql = """
            SELECT
                SOURCE_SYSTEM AS SOURCE,
                SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
                SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
                SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
                SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
                SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
                SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
            FROM RECEIVED_MESSAGE
            WHERE CREATE_TIMESTAMP > ?
            GROUP BY SOURCE_SYSTEM
            ORDER BY SOURCE_SYSTEM
            """;

        return jdbcTemplate.query(sql, ps -> {
            ps.setTimestamp(1, fromCreateTimestamp);
        }, (rs, rowNum) -> {
            CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
            row.setSource(rs.getString("SOURCE"));
            row.setTopUps(rs.getInt("TOP_UPS"));
            row.setDrawdowns(rs.getInt("DRAWDOWNS"));
            row.setAdmi006(rs.getInt("ADMI_006"));
            row.setCamt052(rs.getInt("CAMT_052"));
            row.setAdmi002(rs.getInt("ADMI_002"));
            row.setPacs002(rs.getInt("PACS_002"));
            return row;
        });
    }
}
Service layer
This is where you should calculate the timestamp boundary.

@Service
public class DashboardStatisticsService {

    private final ReceivedMessageDao receivedMessageDao;

    public DashboardStatisticsService(ReceivedMessageDao receivedMessageDao) {
        this.receivedMessageDao = receivedMessageDao;
    }

    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        Timestamp fromCreateTimestamp = determineFromCreateTimestamp();
        String cycleDate = determineCycleDateDisplay();

        List<CurrentCycleStatisticsRow> rows =
                receivedMessageDao.getCurrentCycleStatisticsRows(fromCreateTimestamp);

        CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
        response.setCycleDate(cycleDate);
        response.setRows(rows);
        return response;
    }

    private Timestamp determineFromCreateTimestamp() {
        LocalDate currentCycleDate = LocalDate.now();

        ZonedDateTime fromDateTime = currentCycleDate
                .minusDays(1)
                .atTime(19, 0)
                .atZone(ZoneId.of("America/New_York"));

        return Timestamp.from(fromDateTime.toInstant());
    }

    private String determineCycleDateDisplay() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("MM/dd/yy"));
    }
}
Controller
@RestController
@RequestMapping("/dashboard")
public class DashboardStatisticsController {

    private final DashboardStatisticsService dashboardStatisticsService;

    public DashboardStatisticsController(DashboardStatisticsService dashboardStatisticsService) {
        this.dashboardStatisticsService = dashboardStatisticsService;
    }

    @GetMapping("/current-cycle-statistics")
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        return dashboardStatisticsService.getCurrentCycleStatistics();
    }
}
If you need both lower and upper timestamp
That is even better, because > alone can keep growing forever.

Use:

WHERE CREATE_TIMESTAMP > ?
  AND CREATE_TIMESTAMP <= ?
DB2 query:

SELECT
    SOURCE_SYSTEM AS SOURCE,
    SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
    SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
    SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
    SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
  AND CREATE_TIMESTAMP <= ?
GROUP BY SOURCE_SYSTEM
ORDER BY SOURCE_SYSTEM
DAO method:

public List<CurrentCycleStatisticsRow> getCurrentCycleStatisticsRows(
        Timestamp fromCreateTimestamp,
        Timestamp toCreateTimestamp) {
This is usually safer for cycle-based reporting.

Important DB2 note
If MESSAGE_TYPE values are not exactly like:

TOP_UPS

DRAWDOWNS

ADMI.006

CAMT.052

ADMI.002

PACS.002

then change the SQL to match your real stored values.

For example, if DB stores:

admi006

camt052

admi002

then use those exact values in CASE WHEN.

If source is not stored as Fedwire/FedNow directly
Sometimes DB stores a code like:

FW

FN

Then do this:

SELECT
    CASE
        WHEN SOURCE_SYSTEM = 'FW' THEN 'Fedwire'
        WHEN SOURCE_SYSTEM = 'FN' THEN 'FedNow'
        ELSE SOURCE_SYSTEM
    END AS SOURCE,
    SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
    SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
    SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
    SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY
    CASE
        WHEN SOURCE_SYSTEM = 'FW' THEN 'Fedwire'
        WHEN SOURCE_SYSTEM = 'FN' THEN 'FedNow'
        ELSE SOURCE_SYSTEM
    END
ORDER BY SOURCE
Best implementation choice
For your case, I would do this:

calculate fromCreateTimestamp in service

use one DB2 aggregate query

return rows already in Grid 1 shape

do not run 6 or 12 separate queries

That is the cleanest and most efficient.

My recommendation in one sentence
Use a single DB2 conditional aggregation query with SUM(CASE WHEN ...) and WHERE CREATE_TIMESTAMP > ?, then map the result directly into CurrentCycleStatisticsRow.

If you paste your real DB2 column names for:

source column

message type column

timestamp column

actual stored values for Fedwire/FedNow and message types

I’ll turn this into your exact final SQL and DAO code.


Its a spring boot app and using jdbcTemplate 

Perfect. With Spring Boot + JdbcTemplate + DB2, I’d implement Grid 1 like this:

service figures out the fromCreateTimestamp

DAO/repository runs one DB2 aggregate query

query returns rows already shaped for the grid

controller returns that response to Kendo

That is the cleanest setup.

1. Model classes
Grid row
public class CurrentCycleStatisticsRow {

    private String source;
    private int topUps;
    private int drawdowns;
    private int admi006;
    private int camt052;
    private int admi002;
    private int pacs002;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public int getTopUps() {
        return topUps;
    }

    public void setTopUps(int topUps) {
        this.topUps = topUps;
    }

    public int getDrawdowns() {
        return drawdowns;
    }

    public void setDrawdowns(int drawdowns) {
        this.drawdowns = drawdowns;
    }

    public int getAdmi006() {
        return admi006;
    }

    public void setAdmi006(int admi006) {
        this.admi006 = admi006;
    }

    public int getCamt052() {
        return camt052;
    }

    public void setCamt052(int camt052) {
        this.camt052 = camt052;
    }

    public int getAdmi002() {
        return admi002;
    }

    public void setAdmi002(int admi002) {
        this.admi002 = admi002;
    }

    public int getPacs002() {
        return pacs002;
    }

    public void setPacs002(int pacs002) {
        this.pacs002 = pacs002;
    }
}
Response wrapper
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
2. Repository using JdbcTemplate
This is the main part.

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class ReceivedMessageRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReceivedMessageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
        String sql = """
            SELECT
                SOURCE_SYSTEM AS SOURCE,
                SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
                SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
                SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
                SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
                SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
                SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
            FROM RECEIVED_MESSAGE
            WHERE CREATE_TIMESTAMP > ?
            GROUP BY SOURCE_SYSTEM
            ORDER BY SOURCE_SYSTEM
            """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
                    row.setSource(rs.getString("SOURCE"));
                    row.setTopUps(rs.getInt("TOP_UPS"));
                    row.setDrawdowns(rs.getInt("DRAWDOWNS"));
                    row.setAdmi006(rs.getInt("ADMI_006"));
                    row.setCamt052(rs.getInt("CAMT_052"));
                    row.setAdmi002(rs.getInt("ADMI_002"));
                    row.setPacs002(rs.getInt("PACS_002"));
                    return row;
                },
                fromCreateTimestamp
        );
    }
}
3. Service layer
This is where you calculate the timestamp.

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DashboardStatisticsService {

    private final ReceivedMessageRepository receivedMessageRepository;

    public DashboardStatisticsService(ReceivedMessageRepository receivedMessageRepository) {
        this.receivedMessageRepository = receivedMessageRepository;
    }

    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        Timestamp fromCreateTimestamp = determineFromCreateTimestamp();
        String cycleDate = determineCycleDateDisplay();

        List<CurrentCycleStatisticsRow> rows =
                receivedMessageRepository.findCurrentCycleStatisticsRows(fromCreateTimestamp);

        CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
        response.setCycleDate(cycleDate);
        response.setRows(rows);

        return response;
    }

    private Timestamp determineFromCreateTimestamp() {
        LocalDate currentCycleDate = LocalDate.now();

        ZonedDateTime fromDateTime = currentCycleDate
                .minusDays(1)
                .atTime(19, 0)
                .atZone(ZoneId.of("America/New_York"));

        return Timestamp.from(fromDateTime.toInstant());
    }

    private String determineCycleDateDisplay() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("MM/dd/yy"));
    }
}
4. Controller
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardStatisticsController {

    private final DashboardStatisticsService dashboardStatisticsService;

    public DashboardStatisticsController(DashboardStatisticsService dashboardStatisticsService) {
        this.dashboardStatisticsService = dashboardStatisticsService;
    }

    @GetMapping("/current-cycle-statistics")
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        return dashboardStatisticsService.getCurrentCycleStatistics();
    }
}
5. If you need both from and to timestamp
That is usually better for cycle reporting.

Repository
public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(
        Timestamp fromCreateTimestamp,
        Timestamp toCreateTimestamp) {

    String sql = """
        SELECT
            SOURCE_SYSTEM AS SOURCE,
            SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
            SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
            SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
            SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
            SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
            SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
        FROM RECEIVED_MESSAGE
        WHERE CREATE_TIMESTAMP > ?
          AND CREATE_TIMESTAMP <= ?
        GROUP BY SOURCE_SYSTEM
        ORDER BY SOURCE_SYSTEM
        """;

    return jdbcTemplate.query(
            sql,
            (rs, rowNum) -> {
                CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
                row.setSource(rs.getString("SOURCE"));
                row.setTopUps(rs.getInt("TOP_UPS"));
                row.setDrawdowns(rs.getInt("DRAWDOWNS"));
                row.setAdmi006(rs.getInt("ADMI_006"));
                row.setCamt052(rs.getInt("CAMT_052"));
                row.setAdmi002(rs.getInt("ADMI_002"));
                row.setPacs002(rs.getInt("PACS_002"));
                return row;
            },
            fromCreateTimestamp,
            toCreateTimestamp
    );
}
6. Better if source codes are stored differently
If DB stores FW and FN instead of Fedwire and FedNow, map them in SQL.

SELECT
    CASE
        WHEN SOURCE_SYSTEM = 'FW' THEN 'Fedwire'
        WHEN SOURCE_SYSTEM = 'FN' THEN 'FedNow'
        ELSE SOURCE_SYSTEM
    END AS SOURCE,
    SUM(CASE WHEN MESSAGE_TYPE = 'TOP_UPS' THEN 1 ELSE 0 END) AS TOP_UPS,
    SUM(CASE WHEN MESSAGE_TYPE = 'DRAWDOWNS' THEN 1 ELSE 0 END) AS DRAWDOWNS,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.006' THEN 1 ELSE 0 END) AS ADMI_006,
    SUM(CASE WHEN MESSAGE_TYPE = 'CAMT.052' THEN 1 ELSE 0 END) AS CAMT_052,
    SUM(CASE WHEN MESSAGE_TYPE = 'ADMI.002' THEN 1 ELSE 0 END) AS ADMI_002,
    SUM(CASE WHEN MESSAGE_TYPE = 'PACS.002' THEN 1 ELSE 0 END) AS PACS_002
FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY
    CASE
        WHEN SOURCE_SYSTEM = 'FW' THEN 'Fedwire'
        WHEN SOURCE_SYSTEM = 'FN' THEN 'FedNow'
        ELSE SOURCE_SYSTEM
    END
ORDER BY SOURCE
7. Important practical note
Your real DB values may not exactly be:

TOP_UPS

DRAWDOWNS

ADMI.006

CAMT.052

ADMI.002

PACS.002

Use the exact value stored in DB2.

For example, if DB has:

admi006

admi002

camt052

then your SQL must match those exact values.

8. If you want guaranteed Fedwire and FedNow rows
Sometimes query only returns one row if there is no data for the other source.

If you always want both rows in the grid, fill missing rows in service:

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
    Timestamp fromCreateTimestamp = determineFromCreateTimestamp();
    String cycleDate = determineCycleDateDisplay();

    List<CurrentCycleStatisticsRow> dbRows =
            receivedMessageRepository.findCurrentCycleStatisticsRows(fromCreateTimestamp);

    Map<String, CurrentCycleStatisticsRow> rowMap = new LinkedHashMap<>();
    rowMap.put("Fedwire", createEmptyRow("Fedwire"));
    rowMap.put("FedNow", createEmptyRow("FedNow"));

    for (CurrentCycleStatisticsRow row : dbRows) {
        rowMap.put(row.getSource(), row);
    }

    CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
    response.setCycleDate(cycleDate);
    response.setRows(new ArrayList<>(rowMap.values()));

    return response;
}

private CurrentCycleStatisticsRow createEmptyRow(String source) {
    CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
    row.setSource(source);
    row.setTopUps(0);
    row.setDrawdowns(0);
    row.setAdmi006(0);
    row.setCamt052(0);
    row.setAdmi002(0);
    row.setPacs002(0);
    return row;
}
That is very useful for UI consistency.

9. Best recommendation for your app
For your Spring Boot app, I would use this exact pattern:

JdbcTemplate

one DB2 aggregate query

repository returns List<CurrentCycleStatisticsRow>

service computes timestamp and fills missing rows if needed

controller returns wrapper response

That is simple, fast, and easy to maintain.

10. Final shape
Repository method
List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp)
Service method
CurrentCycleStatisticsResponse getCurrentCycleStatistics()
Controller endpoint
GET /dashboard/current-cycle-statistics
If you paste your actual DB2 column names and exact message type values, I’ll rewrite the SQL exactly for your table.


what if the message_type can be either or 

That is fine — use IN (...) in the CASE WHEN.

So if one grid column should count records where message_type can be either of multiple values, do this:

Example
If admi006 should count both:

ADMI.006

admi006

then:

SUM(CASE 
      WHEN MESSAGE_TYPE IN ('ADMI.006', 'admi006') THEN 1 
      ELSE 0 
    END) AS ADMI_006
Full example in DB2
SELECT
    SOURCE_SYSTEM AS SOURCE,

    SUM(CASE
          WHEN MESSAGE_TYPE IN ('TOP_UP', 'TOP_UPS')
          THEN 1 ELSE 0
        END) AS TOP_UPS,

    SUM(CASE
          WHEN MESSAGE_TYPE IN ('DRAWDOWN', 'DRAWDOWNS')
          THEN 1 ELSE 0
        END) AS DRAWDOWNS,

    SUM(CASE
          WHEN MESSAGE_TYPE IN ('ADMI.006', 'ADMI006')
          THEN 1 ELSE 0
        END) AS ADMI_006,

    SUM(CASE
          WHEN MESSAGE_TYPE IN ('CAMT.052', 'CAMT052')
          THEN 1 ELSE 0
        END) AS CAMT_052,

    SUM(CASE
          WHEN MESSAGE_TYPE IN ('ADMI.002', 'ADMI002')
          THEN 1 ELSE 0
        END) AS ADMI_002,

    SUM(CASE
          WHEN MESSAGE_TYPE IN ('PACS.002', 'PACS002')
          THEN 1 ELSE 0
        END) AS PACS_002

FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY SOURCE_SYSTEM
ORDER BY SOURCE_SYSTEM
If you mean OR condition
This:

WHEN MESSAGE_TYPE = 'ADMI.006' OR MESSAGE_TYPE = 'ADMI006'
works too, but IN is cleaner:

WHEN MESSAGE_TYPE IN ('ADMI.006', 'ADMI006')
In your Spring Boot JdbcTemplate repository
Nothing changes except the SQL:

public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
    String sql = """
        SELECT
            SOURCE_SYSTEM AS SOURCE,

            SUM(CASE
                  WHEN MESSAGE_TYPE IN ('TOP_UP', 'TOP_UPS')
                  THEN 1 ELSE 0
                END) AS TOP_UPS,

            SUM(CASE
                  WHEN MESSAGE_TYPE IN ('DRAWDOWN', 'DRAWDOWNS')
                  THEN 1 ELSE 0
                END) AS DRAWDOWNS,

            SUM(CASE
                  WHEN MESSAGE_TYPE IN ('ADMI.006', 'ADMI006')
                  THEN 1 ELSE 0
                END) AS ADMI_006,

            SUM(CASE
                  WHEN MESSAGE_TYPE IN ('CAMT.052', 'CAMT052')
                  THEN 1 ELSE 0
                END) AS CAMT_052,

            SUM(CASE
                  WHEN MESSAGE_TYPE IN ('ADMI.002', 'ADMI002')
                  THEN 1 ELSE 0
                END) AS ADMI_002,

            SUM(CASE
                  WHEN MESSAGE_TYPE IN ('PACS.002', 'PACS002')
                  THEN 1 ELSE 0
                END) AS PACS_002

        FROM RECEIVED_MESSAGE
        WHERE CREATE_TIMESTAMP > ?
        GROUP BY SOURCE_SYSTEM
        ORDER BY SOURCE_SYSTEM
        """;

    return jdbcTemplate.query(
            sql,
            (rs, rowNum) -> {
                CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
                row.setSource(rs.getString("SOURCE"));
                row.setTopUps(rs.getInt("TOP_UPS"));
                row.setDrawdowns(rs.getInt("DRAWDOWNS"));
                row.setAdmi006(rs.getInt("ADMI_006"));
                row.setCamt052(rs.getInt("CAMT_052"));
                row.setAdmi002(rs.getInt("ADMI_002"));
                row.setPacs002(rs.getInt("PACS_002"));
                return row;
            },
            fromCreateTimestamp
    );
}
If one column depends on completely different message types
Example:

Top-Ups should count both pacs.008 and pacs.009

Then:

SUM(CASE
      WHEN MESSAGE_TYPE IN ('PACS.008', 'PACS.009')
      THEN 1 ELSE 0
    END) AS TOP_UPS
So each grid column can represent:

one exact type

multiple types

even mixed business values

If case may vary
If DB has mixed case like:

admi.006

ADMI.006

Admi.006

then use UPPER():

SUM(CASE
      WHEN UPPER(MESSAGE_TYPE) IN ('ADMI.006', 'ADMI006')
      THEN 1 ELSE 0
    END) AS ADMI_006
That is safer.

Example:

SUM(CASE
      WHEN UPPER(MESSAGE_TYPE) IN ('CAMT.052', 'CAMT052')
      THEN 1 ELSE 0
    END) AS CAMT_052
Best practice for your case
If message_type can be either:

use IN (...)

if case may differ, use UPPER(MESSAGE_TYPE) IN (...)

Best version:
SUM(CASE
      WHEN UPPER(MESSAGE_TYPE) IN ('ADMI.006', 'ADMI006')
      THEN 1 ELSE 0
    END) AS ADMI_006
Simple answer
Use this pattern:

SUM(CASE WHEN MESSAGE_TYPE IN ('value1', 'value2') THEN 1 ELSE 0 END)
or safer:

SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('VALUE1', 'VALUE2') THEN 1 ELSE 0 END)
If you want, send me one real example like:

“Top-Ups = these message types”

“Drawdowns = these message types”

and I’ll write the full DB2 query exactly for your grid.


what if need to use like?

Good question — yes, you can use LIKE inside CASE WHEN in DB2, and sometimes you have to if message types are not exact.

When to use LIKE
Use LIKE when:

message types have patterns (e.g. admi.006.v1, admi.006.test)

or inconsistent formatting

Basic pattern
SUM(CASE 
      WHEN MESSAGE_TYPE LIKE 'ADMI.006%' 
      THEN 1 ELSE 0 
    END) AS ADMI_006
👉 This counts:

ADMI.006

ADMI.006.V1

ADMI.006_TEST

Multiple LIKE conditions
If you need multiple patterns:

SUM(CASE 
      WHEN MESSAGE_TYPE LIKE 'ADMI.006%' 
        OR MESSAGE_TYPE LIKE 'ADMI006%' 
      THEN 1 ELSE 0 
    END) AS ADMI_006
Case-insensitive (VERY important in DB2)
DB2 is case-sensitive unless configured otherwise.

So safest approach:

SUM(CASE 
      WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' 
      THEN 1 ELSE 0 
    END) AS ADMI_006
Full DB2 example with LIKE
SELECT
    SOURCE_SYSTEM AS SOURCE,

    SUM(CASE 
          WHEN UPPER(MESSAGE_TYPE) LIKE 'TOP_UP%' 
          THEN 1 ELSE 0 
        END) AS TOP_UPS,

    SUM(CASE 
          WHEN UPPER(MESSAGE_TYPE) LIKE 'DRAWDOWN%' 
          THEN 1 ELSE 0 
        END) AS DRAWDOWNS,

    SUM(CASE 
          WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' 
          THEN 1 ELSE 0 
        END) AS ADMI_006,

    SUM(CASE 
          WHEN UPPER(MESSAGE_TYPE) LIKE 'CAMT.052%' 
          THEN 1 ELSE 0 
        END) AS CAMT_052,

    SUM(CASE 
          WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.002%' 
          THEN 1 ELSE 0 
        END) AS ADMI_002,

    SUM(CASE 
          WHEN UPPER(MESSAGE_TYPE) LIKE 'PACS.002%' 
          THEN 1 ELSE 0 
        END) AS PACS_002

FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY SOURCE_SYSTEM
ORDER BY SOURCE_SYSTEM
Mixing LIKE + IN (best combo sometimes)
If some are exact and some are pattern-based:

SUM(CASE 
      WHEN UPPER(MESSAGE_TYPE) IN ('ADMI006')
        OR UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' 
      THEN 1 ELSE 0 
    END) AS ADMI_006
Performance warning ⚠️
Using LIKE '%something%' (with leading %) is slow because:

DB2 cannot use index efficiently

BAD (slow)
LIKE '%ADMI.006%'
GOOD (fast)
LIKE 'ADMI.006%'
👉 Always avoid leading % if possible.

JdbcTemplate — no change needed
Your Java stays the same — only SQL changes.

String sql = """
    SELECT
        SOURCE_SYSTEM AS SOURCE,
        SUM(CASE 
              WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' 
              THEN 1 ELSE 0 
            END) AS ADMI_006
    FROM RECEIVED_MESSAGE
    WHERE CREATE_TIMESTAMP > ?
    GROUP BY SOURCE_SYSTEM
    """;
When to choose what
Case	Use
Exact values	IN (...)
Pattern (starts with)	LIKE 'value%'
Mixed formats	IN + LIKE
Case differences	UPPER()
My recommendation for your app
For your Fed/FedNow message types:

👉 Use this combo:

SUM(CASE 
      WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' 
        OR UPPER(MESSAGE_TYPE) = 'ADMI006'
      THEN 1 ELSE 0 
    END)
That handles:

format differences

version suffixes

case issues

Simple answer
Yes — just use:

SUM(CASE WHEN MESSAGE_TYPE LIKE 'pattern%' THEN 1 ELSE 0 END)
or safer:

SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'PATTERN%' THEN 1 ELSE 0 END)
If you send me 2–3 real values from your DB, I’ll write the exact final SQL for your table 👍


If I use like, will be less performant? 

Short answer: it depends how you use LIKE.

🚀 Performance truth (DB2)
✅ Fast (index-friendly)
WHERE MESSAGE_TYPE LIKE 'ADMI.006%'
👉 This can use an index on MESSAGE_TYPE
👉 Performance is usually good

❌ Slow (avoid this)
WHERE MESSAGE_TYPE LIKE '%ADMI.006%'
👉 Leading % = full table scan
👉 DB2 cannot use index
👉 This is where performance drops

⚖️ Your case (important nuance)
You are using:

SUM(CASE WHEN ... THEN 1 ELSE 0 END)
NOT filtering rows — just counting inside aggregation.

👉 That means:

DB2 is already scanning the filtered dataset (WHERE create_timestamp > ?)

The cost difference between LIKE vs IN is much smaller

🧠 Real impact in your query
Your query shape:
FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY SOURCE_SYSTEM
👉 DB2 will:

Use index on CREATE_TIMESTAMP (if exists) ✅

Scan those rows

Apply CASE WHEN logic

So:
Condition	Impact
IN ('A','B')	fastest
LIKE 'ABC%'	slightly slower
LIKE '%ABC%'	slow ❌
🟢 Recommendation for you
Best option (if possible)
IN ('ADMI.006', 'ADMI006')
✔ fastest
✔ clean
✔ index-friendly

If you must support variations
UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%'
✔ flexible
✔ still OK performance (no leading %)

Avoid this
LIKE '%ADMI.006%'
❌ slow
❌ no index usage
❌ bad for large tables

⚡ DB2 optimization tip (very important)
If your table is large (millions of rows):

👉 Create index:

CREATE INDEX IDX_RECEIVED_MSG_TS 
ON RECEIVED_MESSAGE (CREATE_TIMESTAMP)
👉 Optional:

CREATE INDEX IDX_RECEIVED_MSG_TYPE 
ON RECEIVED_MESSAGE (MESSAGE_TYPE)
🧠 Best production pattern
If your values are messy, normalize instead of using LIKE:

Better approach:
UPPER(MESSAGE_TYPE) IN ('ADMI.006', 'ADMI006')
👉 avoids LIKE
👉 faster
👉 predictable

🔥 Final verdict
Scenario	Recommendation
Exact known values	IN ✅
Prefix matching	LIKE 'value%' ✅
Unknown patterns	LIKE (careful)
Contains search	❌ avoid
💡 My advice for your app
Since this is payments / Fed / message system (high volume):

👉 Use this:

SUM(CASE 
      WHEN UPPER(MESSAGE_TYPE) IN ('ADMI.006', 'ADMI006') 
      THEN 1 ELSE 0 
    END)
Only use LIKE if:

values are inconsistent

or have suffixes like .v1, .test

👍 Simple answer
LIKE 'ABC%' → fine

LIKE '%ABC%' → slow

IN (...) → best

If you want, I can help you analyze your actual DB values and pick the fastest strategy 👍


What should be the appropriate property name for the sql in db.p[roperties? 

Good question — this is one of those small things that makes a big difference later 👍

Since you’re putting SQL in db.properties, the name should be:

clear

aligned to use-case (not table name)

consistent with your repo/service naming

✅ Recommended naming pattern
Use this format:

<module>.<feature>.<action>
or

<domain>.<usecase>.sql
🎯 For your case (Grid 1)
This query is:

dashboard-related

current cycle

statistics/counts

based on received messages

✅ Best name (recommended)
dashboard.currentCycleStatistics.query=
✔ clean
✔ matches your endpoint
✔ easy to find later

✅ Alternative good options
Option 2
receivedMessage.currentCycleStats.query=
Option 3
dashboard.receivedMessage.aggregate.query=
Option 4 (shorter)
dashboard.cycleStats.sql=
❌ Avoid these names
selectQuery=
query1=
receivedMessageQuery=
getData=
sql1=
👉 too generic → nightmare later

💡 My recommendation (stick with this)
dashboard.currentCycleStatistics.query=
And for your second grid:

dashboard.connectivityStatus.query=
📦 Example db.properties
dashboard.currentCycleStatistics.query=
SELECT
    SOURCE_SYSTEM AS SOURCE,
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('TOP_UP', 'TOP_UPS') THEN 1 ELSE 0 END) AS TOP_UPS,
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('DRAWDOWN', 'DRAWDOWNS') THEN 1 ELSE 0 END) AS DRAWDOWNS,
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' THEN 1 ELSE 0 END) AS ADMI_006,
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'CAMT.052%' THEN 1 ELSE 0 END) AS CAMT_052,
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.002%' THEN 1 ELSE 0 END) AS ADMI_002,
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'PACS.002%' THEN 1 ELSE 0 END) AS PACS_002
FROM RECEIVED_MESSAGE
WHERE CREATE_TIMESTAMP > ?
GROUP BY SOURCE_SYSTEM
🧠 Bonus tip (very useful later)
If you plan multiple queries for same feature:

dashboard.currentCycleStatistics.main.query=
dashboard.currentCycleStatistics.withRange.query=
dashboard.currentCycleStatistics.bySource.query=
👍 Final answer
👉 Use:

dashboard.currentCycleStatistics.query
It’s the cleanest, most maintainable, and matches your use case perfectly.

If you want, I can also show you how to inject this property into your JdbcTemplate cleanly (no hardcoding) 👍


Give me the dao with jdbcTemplate spring boot again 

Sure — here is a clean DAO / repository example for Spring Boot + JdbcTemplate + DB2 for Grid 1.

This version:

reads SQL from db.properties

accepts fromCreateTimestamp

returns List<CurrentCycleStatisticsRow>

uses one aggregate query

db.properties
dashboard.currentCycleStatistics.query=
SELECT \
    SOURCE_SYSTEM AS SOURCE, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('TOP_UP', 'TOP_UPS') THEN 1 ELSE 0 END) AS TOP_UPS, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('DRAWDOWN', 'DRAWDOWNS') THEN 1 ELSE 0 END) AS DRAWDOWNS, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' THEN 1 ELSE 0 END) AS ADMI_006, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'CAMT.052%' THEN 1 ELSE 0 END) AS CAMT_052, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.002%' THEN 1 ELSE 0 END) AS ADMI_002, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'PACS.002%' THEN 1 ELSE 0 END) AS PACS_002 \
FROM RECEIVED_MESSAGE \
WHERE CREATE_TIMESTAMP > ? \
GROUP BY SOURCE_SYSTEM \
ORDER BY SOURCE_SYSTEM
Model class
public class CurrentCycleStatisticsRow {

    private String source;
    private int topUps;
    private int drawdowns;
    private int admi006;
    private int camt052;
    private int admi002;
    private int pacs002;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public int getTopUps() {
        return topUps;
    }

    public void setTopUps(int topUps) {
        this.topUps = topUps;
    }

    public int getDrawdowns() {
        return drawdowns;
    }

    public void setDrawdowns(int drawdowns) {
        this.drawdowns = drawdowns;
    }

    public int getAdmi006() {
        return admi006;
    }

    public void setAdmi006(int admi006) {
        this.admi006 = admi006;
    }

    public int getCamt052() {
        return camt052;
    }

    public void setCamt052(int camt052) {
        this.camt052 = camt052;
    }

    public int getAdmi002() {
        return admi002;
    }

    public void setAdmi002(int admi002) {
        this.admi002 = admi002;
    }

    public int getPacs002() {
        return pacs002;
    }

    public void setPacs002(int pacs002) {
        this.pacs002 = pacs002;
    }
}
DAO / Repository
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;
    private final String currentCycleStatisticsQuery;

    public ReceivedMessageDao(
            JdbcTemplate jdbcTemplate,
            @Value("${dashboard.currentCycleStatistics.query}") String currentCycleStatisticsQuery) {
        this.jdbcTemplate = jdbcTemplate;
        this.currentCycleStatisticsQuery = currentCycleStatisticsQuery;
    }

    public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
        return jdbcTemplate.query(
                currentCycleStatisticsQuery,
                ps -> ps.setTimestamp(1, fromCreateTimestamp),
                (rs, rowNum) -> {
                    CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
                    row.setSource(rs.getString("SOURCE"));
                    row.setTopUps(rs.getInt("TOP_UPS"));
                    row.setDrawdowns(rs.getInt("DRAWDOWNS"));
                    row.setAdmi006(rs.getInt("ADMI_006"));
                    row.setCamt052(rs.getInt("CAMT_052"));
                    row.setAdmi002(rs.getInt("ADMI_002"));
                    row.setPacs002(rs.getInt("PACS_002"));
                    return row;
                }
        );
    }
}
Cleaner version with a RowMapper
If you want it a little cleaner:

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;
    private final String currentCycleStatisticsQuery;

    public ReceivedMessageDao(
            JdbcTemplate jdbcTemplate,
            @Value("${dashboard.currentCycleStatistics.query}") String currentCycleStatisticsQuery) {
        this.jdbcTemplate = jdbcTemplate;
        this.currentCycleStatisticsQuery = currentCycleStatisticsQuery;
    }

    public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
        return jdbcTemplate.query(
                currentCycleStatisticsQuery,
                new CurrentCycleStatisticsRowMapper(),
                fromCreateTimestamp
        );
    }

    private static class CurrentCycleStatisticsRowMapper implements RowMapper<CurrentCycleStatisticsRow> {
        @Override
        public CurrentCycleStatisticsRow mapRow(ResultSet rs, int rowNum) throws SQLException {
            CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
            row.setSource(rs.getString("SOURCE"));
            row.setTopUps(rs.getInt("TOP_UPS"));
            row.setDrawdowns(rs.getInt("DRAWDOWNS"));
            row.setAdmi006(rs.getInt("ADMI_006"));
            row.setCamt052(rs.getInt("CAMT_052"));
            row.setAdmi002(rs.getInt("ADMI_002"));
            row.setPacs002(rs.getInt("PACS_002"));
            return row;
        }
    }
}
If you need both from and to
Then use this DAO method instead:

public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(
        Timestamp fromCreateTimestamp,
        Timestamp toCreateTimestamp) {
    return jdbcTemplate.query(
            currentCycleStatisticsQuery,
            new CurrentCycleStatisticsRowMapper(),
            fromCreateTimestamp,
            toCreateTimestamp
    );
}
And your SQL in db.properties becomes:

dashboard.currentCycleStatistics.query=
SELECT \
    SOURCE_SYSTEM AS SOURCE, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('TOP_UP', 'TOP_UPS') THEN 1 ELSE 0 END) AS TOP_UPS, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('DRAWDOWN', 'DRAWDOWNS') THEN 1 ELSE 0 END) AS DRAWDOWNS, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' THEN 1 ELSE 0 END) AS ADMI_006, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'CAMT.052%' THEN 1 ELSE 0 END) AS CAMT_052, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.002%' THEN 1 ELSE 0 END) AS ADMI_002, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'PACS.002%' THEN 1 ELSE 0 END) AS PACS_002 \
FROM RECEIVED_MESSAGE \
WHERE CREATE_TIMESTAMP > ? \
  AND CREATE_TIMESTAMP <= ? \
GROUP BY SOURCE_SYSTEM \
ORDER BY SOURCE_SYSTEM
Typical service call
Timestamp fromCreateTimestamp = determineFromCreateTimestamp();
List<CurrentCycleStatisticsRow> rows =
        receivedMessageDao.findCurrentCycleStatisticsRows(fromCreateTimestamp);
My recommendation
Use the second version with RowMapper. It is cleaner and easier to maintain.

If you want, next I can give you the service + controller for this exact DAO.


okay

Nice 👍 let’s wire the whole thing cleanly so your Grid 1 works end-to-end.

🧩 Final Structure (what you’ll have)
DAO → runs DB2 query

Service → calculates timestamp + prepares response

Controller → exposes API

Frontend (Kendo) → calls endpoint

1. Service Layer
This is where your business logic lives (VERY important).

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardStatisticsService {

    private final ReceivedMessageDao receivedMessageDao;

    public DashboardStatisticsService(ReceivedMessageDao receivedMessageDao) {
        this.receivedMessageDao = receivedMessageDao;
    }

    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {

        // 1. Determine time window
        Timestamp fromCreateTimestamp = determineFromCreateTimestamp();

        // 2. Call DAO
        List<CurrentCycleStatisticsRow> dbRows =
                receivedMessageDao.findCurrentCycleStatisticsRows(fromCreateTimestamp);

        // 3. Ensure both Fedwire + FedNow always exist
        Map<String, CurrentCycleStatisticsRow> rowMap = new LinkedHashMap<>();
        rowMap.put("Fedwire", createEmptyRow("Fedwire"));
        rowMap.put("FedNow", createEmptyRow("FedNow"));

        for (CurrentCycleStatisticsRow row : dbRows) {
            rowMap.put(row.getSource(), row);
        }

        // 4. Build response
        CurrentCycleStatisticsResponse response = new CurrentCycleStatisticsResponse();
        response.setCycleDate(determineCycleDateDisplay());
        response.setRows(new ArrayList<>(rowMap.values()));

        return response;
    }

    private Timestamp determineFromCreateTimestamp() {
        LocalDate currentCycleDate = LocalDate.now();

        ZonedDateTime fromDateTime = currentCycleDate
                .minusDays(1)
                .atTime(19, 0) // 7 PM EST
                .atZone(ZoneId.of("America/New_York"));

        return Timestamp.from(fromDateTime.toInstant());
    }

    private String determineCycleDateDisplay() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("MM/dd/yy"));
    }

    private CurrentCycleStatisticsRow createEmptyRow(String source) {
        CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();
        row.setSource(source);
        row.setTopUps(0);
        row.setDrawdowns(0);
        row.setAdmi006(0);
        row.setCamt052(0);
        row.setAdmi002(0);
        row.setPacs002(0);
        return row;
    }
}
2. Controller
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardStatisticsController {

    private final DashboardStatisticsService service;

    public DashboardStatisticsController(DashboardStatisticsService service) {
        this.service = service;
    }

    @GetMapping("/current-cycle-statistics")
    public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
        return service.getCurrentCycleStatistics();
    }
}
3. Final API output (what Kendo gets)
{
  "cycleDate": "03/11/26",
  "rows": [
    {
      "source": "Fedwire",
      "topUps": 2,
      "drawdowns": 4,
      "admi006": 4,
      "camt052": 0,
      "admi002": 0,
      "pacs002": 0
    },
    {
      "source": "FedNow",
      "topUps": 4,
      "drawdowns": 0,
      "admi006": 6,
      "camt052": 1,
      "admi002": 2,
      "pacs002": 1
    }
  ]
}
4. Frontend (Kendo Grid)
This connects directly to your controller.

$("#cycleStatisticsGrid").kendoGrid({
    dataSource: {
        transport: {
            read: {
                url: "/dashboard/current-cycle-statistics",
                dataType: "json"
            }
        },
        schema: {
            data: "rows"
        }
    },
    scrollable: false,
    pageable: false,
    columns: [
        {
            field: "source",
            title: "Fed Current Cycle",
            template: function(dataItem) {
                return dataItem.source;
            }
        },
        { field: "topUps", title: "Top-Ups" },
        { field: "drawdowns", title: "Drawdowns" },
        { field: "admi006", title: "admi.006" },
        { field: "camt052", title: "CAMT.052" },
        { field: "admi002", title: "admi.002" },
        { field: "pacs002", title: "PACS.002" }
    ],
    dataBound: function(e) {
        const grid = e.sender;
        const data = grid.dataSource.data();

        // Optional: dynamically set header with cycle date
        $.get("/dashboard/current-cycle-statistics", function(resp) {
            grid.thead.find("th:first").html("Fed Current Cycle<br/>" + resp.cycleDate);
        });
    }
});
🔥 Important improvements (based on your use case)
1. Cache this (VERY useful)
You mentioned earlier — this is perfect for caching.

@Cacheable("cycleStats")
public CurrentCycleStatisticsResponse getCurrentCycleStatistics() {
2. Avoid double API call in UI
Instead of calling twice, do:

transport: {
    read: function(options) {
        $.ajax({
            url: "/dashboard/current-cycle-statistics",
            success: function(response) {
                options.success(response.rows);

                $("#cycleStatisticsGrid")
                    .data("kendoGrid")
                    .thead
                    .find("th:first")
                    .html("Fed Current Cycle<br/>" + response.cycleDate);
            }
        });
    }
}
🧠 Final Architecture (clean)
Controller
   ↓
Service (business logic + timestamp)
   ↓
DAO (JdbcTemplate + DB2 query)
   ↓
DB2
👍 My recommendation for you
You now have:

efficient DB2 query ✅

clean DAO ✅

clean service logic ✅

UI-ready response ✅

👉 This is production-quality structure for your use case.

If you want next, I can:

optimize indexing strategy for DB2

or help you build Grid 2 (status) in same pattern

or add caching + scheduler (since you said once per day)


Give me the dao 

Here’s a clean, production-ready DAO using JdbcTemplate for your Grid 1.

This version:

reads SQL from db.properties

supports fromCreateTimestamp

uses a RowMapper

returns List<CurrentCycleStatisticsRow>

✅ DAO (final version)
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;
    private final String currentCycleStatisticsQuery;

    public ReceivedMessageDao(
            JdbcTemplate jdbcTemplate,
            @Value("${dashboard.currentCycleStatistics.query}") String currentCycleStatisticsQuery) {
        this.jdbcTemplate = jdbcTemplate;
        this.currentCycleStatisticsQuery = currentCycleStatisticsQuery;
    }

    public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {
        return jdbcTemplate.query(
                currentCycleStatisticsQuery,
                new CurrentCycleStatisticsRowMapper(),
                fromCreateTimestamp
        );
    }

    private static class CurrentCycleStatisticsRowMapper implements RowMapper<CurrentCycleStatisticsRow> {

        @Override
        public CurrentCycleStatisticsRow mapRow(ResultSet rs, int rowNum) throws SQLException {

            CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();

            row.setSource(rs.getString("SOURCE"));
            row.setTopUps(rs.getInt("TOP_UPS"));
            row.setDrawdowns(rs.getInt("DRAWDOWNS"));
            row.setAdmi006(rs.getInt("ADMI_006"));
            row.setCamt052(rs.getInt("CAMT_052"));
            row.setAdmi002(rs.getInt("ADMI_002"));
            row.setPacs002(rs.getInt("PACS_002"));

            return row;
        }
    }
}
🧩 If you need from + to timestamps
DAO method
public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(
        Timestamp fromCreateTimestamp,
        Timestamp toCreateTimestamp) {

    return jdbcTemplate.query(
            currentCycleStatisticsQuery,
            new CurrentCycleStatisticsRowMapper(),
            fromCreateTimestamp,
            toCreateTimestamp
    );
}
📦 db.properties
Make sure your SQL matches this:

dashboard.currentCycleStatistics.query=
SELECT \
    SOURCE_SYSTEM AS SOURCE, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('TOP_UP', 'TOP_UPS') THEN 1 ELSE 0 END) AS TOP_UPS, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) IN ('DRAWDOWN', 'DRAWDOWNS') THEN 1 ELSE 0 END) AS DRAWDOWNS, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.006%' THEN 1 ELSE 0 END) AS ADMI_006, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'CAMT.052%' THEN 1 ELSE 0 END) AS CAMT_052, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'ADMI.002%' THEN 1 ELSE 0 END) AS ADMI_002, \
    SUM(CASE WHEN UPPER(MESSAGE_TYPE) LIKE 'PACS.002%' THEN 1 ELSE 0 END) AS PACS_002 \
FROM RECEIVED_MESSAGE \
WHERE CREATE_TIMESTAMP > ? \
GROUP BY SOURCE_SYSTEM \
ORDER BY SOURCE_SYSTEM
⚡ Small but important tips
1. Use int (not Integer)
You already do aggregation → values will never be null
So:

int topUps;
✔ faster
✔ safer

2. Column aliases MUST match exactly
These must match:

AS TOP_UPS
AS DRAWDOWNS
AS ADMI_006
And in Java:

rs.getInt("TOP_UPS");
3. If DB returns null (rare case)
You can guard like this:

row.setTopUps(rs.getObject("TOP_UPS") == null ? 0 : rs.getInt("TOP_UPS"));
But usually not needed with SUM.

👍 That’s it
This DAO is:

clean

efficient

DB2-friendly

production-ready

If you want next step, I can:

plug this into your existing service

or debug your actual SQL with real DB values

or help you build the status grid DAO same way


CurrentCycleStatisticsRowMapper without it 

Got it 👍 — you want the DAO without a separate RowMapper class.

Here are the cleanest ways to do it.

✅ Option 1 (Recommended): Lambda RowMapper
This is the best balance — clean and readable.

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class ReceivedMessageDao {

    private final JdbcTemplate jdbcTemplate;
    private final String query;

    public ReceivedMessageDao(
            JdbcTemplate jdbcTemplate,
            @Value("${dashboard.currentCycleStatistics.query}") String query) {
        this.jdbcTemplate = jdbcTemplate;
        this.query = query;
    }

    public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {

        return jdbcTemplate.query(
                query,
                (rs, rowNum) -> {
                    CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();

                    row.setSource(rs.getString("SOURCE"));
                    row.setTopUps(rs.getInt("TOP_UPS"));
                    row.setDrawdowns(rs.getInt("DRAWDOWNS"));
                    row.setAdmi006(rs.getInt("ADMI_006"));
                    row.setCamt052(rs.getInt("CAMT_052"));
                    row.setAdmi002(rs.getInt("ADMI_002"));
                    row.setPacs002(rs.getInt("PACS_002"));

                    return row;
                },
                fromCreateTimestamp
        );
    }
}
✅ Option 2: Using PreparedStatementSetter (if you like control)
public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {

    return jdbcTemplate.query(
            query,
            ps -> ps.setTimestamp(1, fromCreateTimestamp),
            (rs, rowNum) -> {
                CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();

                row.setSource(rs.getString("SOURCE"));
                row.setTopUps(rs.getInt("TOP_UPS"));
                row.setDrawdowns(rs.getInt("DRAWDOWNS"));
                row.setAdmi006(rs.getInt("ADMI_006"));
                row.setCamt052(rs.getInt("CAMT_052"));
                row.setAdmi002(rs.getInt("ADMI_002"));
                row.setPacs002(rs.getInt("PACS_002"));

                return row;
            }
    );
}
👉 This is useful when:

multiple params

dynamic SQL

better control over binding

✅ Option 3: Using queryForList (NOT recommended here)
public List<CurrentCycleStatisticsRow> findCurrentCycleStatisticsRows(Timestamp fromCreateTimestamp) {

    List<Map<String, Object>> rows = jdbcTemplate.queryForList(query, fromCreateTimestamp);

    return rows.stream().map(map -> {
        CurrentCycleStatisticsRow row = new CurrentCycleStatisticsRow();

        row.setSource((String) map.get("SOURCE"));
        row.setTopUps(((Number) map.get("TOP_UPS")).intValue());
        row.setDrawdowns(((Number) map.get("DRAWDOWNS")).intValue());
        row.setAdmi006(((Number) map.get("ADMI_006")).intValue());
        row.setCamt052(((Number) map.get("CAMT_052")).intValue());
        row.setAdmi002(((Number) map.get("ADMI_002")).intValue());
        row.setPacs002(((Number) map.get("PACS_002")).intValue());

        return row;
    }).toList();
}
❌ More verbose
❌ Less type-safe
❌ Not ideal for production

🏆 Best choice
👉 Use Option 1 (lambda RowMapper)

✔ clean
✔ modern
✔ readable
✔ no extra class

⚡ Final answer
You don’t need a separate CurrentCycleStatisticsRowMapper.

Just use:

(rs, rowNum) -> { ... }
inside jdbcTemplate.query(...).

If you want next, I can show you:

how to reuse this mapping across multiple queries

or how to convert this into NamedParameterJdbcTemplate (even cleaner for multiple params)


Uploaded image
Any issue here ?

Yes 👍 — overall this is pretty solid, but I do see a few important issues / improvements you should address (especially since this affects your cycle window logic).

🚨 1. Critical logic issue (time boundary)
Your condition:
if (!currentTime.isBefore(LocalTime.of(19, 1))) {
    currentCycleDate = today.plusDays(1);
} else {
    currentCycleDate = today;
}
❌ Problem:
This only checks after 7:01 PM

But your comment says:

between 7:00 PM – 12:00 AM

👉 You are missing the upper bound (midnight)

✅ Fix (correct logic)
LocalTime start = LocalTime.of(19, 0); // 7:00 PM
LocalTime end = LocalTime.MIDNIGHT;

if (!currentTime.isBefore(start) && currentTime.isBefore(end)) {
    currentCycleDate = today.plusDays(1);
} else {
    currentCycleDate = today;
}
👉 This matches your business rule exactly.

⚠️ 2. 19:1 (7:01 PM) is suspicious
LocalTime.of(19, 1)
👉 Why 7:01 PM?

If business rule is 7:00 PM → use:

LocalTime.of(19, 0)
⚠️ 3. Same logic duplicated twice
You wrote:

// If it refreshed between 7:00 PM - 12:00 AM...
twice

👉 You are repeating logic conceptually

✅ Better approach
Extract method:

private boolean isAfter7PMBeforeMidnight(LocalTime currentTime) {
    return !currentTime.isBefore(LocalTime.of(19, 0))
           && currentTime.isBefore(LocalTime.MIDNIGHT);
}
Then:

if (isAfter7PMBeforeMidnight(currentTime)) {
    currentCycleDate = today.plusDays(1);
} else {
    currentCycleDate = today;
}
⚠️ 4. Closing time logic — subtle bug risk
LocalDate closingDate = currentCycleDate.minusDays(1);

ZonedDateTime closingDateTime = ZonedDateTime.of(
    closingDate,
    LocalTime.of(19, 1),
    ZoneId.of("America/New_York")
);
❗ Problem:
You’re again using 19:01

👉 This can cause:

mismatch with DB values

off-by-one-minute bugs

inconsistent reporting

✅ Fix
LocalTime.of(19, 0)
⚠️ 5. Timezone object created multiple times
You do:

ZoneId.of("America/New_York")
multiple times

✅ Better
private static final ZoneId EST = ZoneId.of("America/New_York");
Then reuse:

ZonedDateTime.now(EST);
⚠️ 6. volatile is okay, but…
private volatile LocalDate currentCycleDate;
private volatile Timestamp currentCycleClosingTime;
👉 This works, but:

You update both together → not atomic

Another thread could read:

new date

old closing time

✅ Better (cleaner design)
Use one object:

public class CycleCache {
    private LocalDate cycleDate;
    private Timestamp closingTime;
}
Then:

private volatile CycleCache cache;
⚠️ 7. @PostConstruct only runs once
@PostConstruct
public void init() {
    refreshCycleDateCache();
}
👉 This means:

cache is initialized once

never refreshed again

❗ Problem
Your cycle changes daily → cache becomes stale

✅ Fix (important)
Add scheduler:

@Scheduled(fixedRate = 60000) // every 1 min or 5 min
public void refreshJob() {
    refreshCycleDateCache();
}
And enable:

@EnableScheduling
⚠️ 8. Null handling is good 👍 but improve logging
You have:

log.warn("No current fed balance found for INTRADAY");
👉 Improve:

log.warn("No current fed balance found for INTRADAY. Using fallback logic.");
⚠️ 9. Minor naming improvement
refreshCycleDateCache()
Better:

refreshCycleCache()
(since you store both date + closing time)

✅ Final verdict
👍 What’s good
timezone handling ✔️

fallback logic ✔️

logging ✔️

clean structure ✔️

🚨 What to fix (priority order)
❗ Fix time condition (7 PM → midnight)

❗ Replace 19:1 → 19:0

❗ Add scheduler (cache refresh)

⚠️ Avoid duplicate logic

⚠️ Consider atomic cache object

💡 My recommendation
Your logic is very close to production-ready, just fix:

👉 time boundary + scheduler

Everything else is improvement, not blocker.

If you want, I can:

rewrite this class into a clean production version

or align it with your DB query window (create_timestamp) so both match perfectly 👍


Uploaded image

This is much better 👍 — you fixed a lot already.
But I still see a couple of important issues + one subtle bug you should fix.

🚨 1. Bug in your time condition (CRITICAL)
Your method:
private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return !localTime.isBefore(LocalTime.of(19, 1)) && localTime.isAfter(LocalTime.MIDNIGHT);
}
❌ Problem:
localTime.isAfter(LocalTime.MIDNIGHT)
👉 This is almost always TRUE except exactly 00:00

So your condition becomes:

time >= 7:01 PM && always true
👉 That means:

10 AM ❌ → false

11 PM ✅ → true

BUT your logic is incorrect and misleading

✅ Correct version
private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return !localTime.isBefore(LocalTime.of(19, 0))
            && localTime.isBefore(LocalTime.MIDNIGHT);
}
💡 Even cleaner
private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return localTime.compareTo(LocalTime.of(19, 0)) >= 0
            && localTime.compareTo(LocalTime.MIDNIGHT) < 0;
}
⚠️ 2. Still using 19:01 (off-by-one bug)
You still have:

LocalTime.of(19, 1)
👉 This is dangerous:

creates 1-minute gap inconsistency

DB vs app mismatch

✅ Fix everywhere
LocalTime.of(19, 0)
⚠️ 3. Same mistake repeated in closing time
LocalTime.of(19, 1)
👉 Same issue — fix it

LocalTime.of(19, 0)
⚠️ 4. Logging typo
log.info("Refreshing cycle date cache..");
👉 Minor but cleaner:

log.info("Refreshing cycle date cache...");
⚠️ 5. Atomicity issue (advanced but important)
You still have:

private volatile LocalDate currentCycleDate;
private volatile Timestamp currentCycleClosingTime;
👉 Problem:

These update separately

Another thread could read:

new date

old closing time ❌

✅ Better design (recommended)
public class CycleCache {
    private LocalDate cycleDate;
    private Timestamp closingTime;

    // getters
}
Then:

private volatile CycleCache cache;
And update atomically:

cache = new CycleCache(currentCycleDate, currentCycleClosingTime);
⚠️ 6. Cache refresh only once
@PostConstruct
public void init() {
    refreshCycleDateCache();
}
👉 This only runs ONCE

❗ Problem
Your cycle changes daily → cache becomes stale

✅ Fix (important)
@Scheduled(fixedRate = 300000) // every 5 minutes
public void refreshJob() {
    refreshCycleDateCache();
}
And:

@EnableScheduling
⚠️ 7. Naming mismatch (minor)
isAfter7pmBeforeMidnight
👉 But your logic originally wasn’t correct — now it will be

✅ Final corrected snippet
Fix method:
private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return !localTime.isBefore(LocalTime.of(19, 0))
            && localTime.isBefore(LocalTime.MIDNIGHT);
}
Fix usage:
if (isAfter7pmBeforeMidnight(currentTime)) {
    currentCycleDate = today.plusDays(1);
} else {
    currentCycleDate = today;
}
Fix closing time:
LocalTime.of(19, 0)
🧠 Final verdict
👍 Good now:
timezone handling ✔️

fallback logic ✔️

structure ✔️

method extraction ✔️

🚨 Must fix:
❗ isAfter(LocalTime.MIDNIGHT) → wrong

❗ 19:01 → use 19:00

⚡ Recommended:
add scheduler

use atomic cache object

💡 My advice
You’re very close to production-ready.

👉 Fix the time logic → otherwise your DB query window will be wrong, and your counts will be off.

If you want, I can next:

align this cache with your DB2 query (create_timestamp window)

so your backend + DAO + UI all use the exact same time boundary (very important in payments systems 👍)


I need 19, 01 

Got it 👍 — if you intentionally need 7:01 PM (19:01), that’s totally fine.
You just need to make sure the logic is correct and consistent everywhere.

✅ Your requirement
You want:

👉 Window = 7:01 PM → 11:59:59 PM

So:

19:00 → ❌ NOT included

19:01 → ✅ included

🚨 Fix your method (still wrong right now)
Your current version (problem):
return !localTime.isBefore(LocalTime.of(19, 1)) 
       && localTime.isAfter(LocalTime.MIDNIGHT);
👉 isAfter(MIDNIGHT) is wrong

✅ Correct version (for 19:01 requirement)
private boolean isAfter701pmBeforeMidnight(LocalTime localTime) {
    return !localTime.isBefore(LocalTime.of(19, 1))
            && localTime.isBefore(LocalTime.MIDNIGHT);
}
🧠 Even clearer version (recommended)
private boolean isAfter701pmBeforeMidnight(LocalTime localTime) {
    LocalTime start = LocalTime.of(19, 1);
    LocalTime end = LocalTime.MIDNIGHT;

    return localTime.compareTo(start) >= 0 && localTime.compareTo(end) < 0;
}
⚠️ IMPORTANT — consistency (this is critical for your app)
Since you chose 19:01, you must use it everywhere:

1. In cycle logic ✅
LocalTime.of(19, 1)
2. In closing time ✅
LocalTime.of(19, 1)
3. In DB query window (VERY IMPORTANT)
Your DAO query:

WHERE CREATE_TIMESTAMP > ?
👉 That ? must be:

LocalTime.of(19, 1)
NOT 19:00

❗ Why this matters
If you mix:

app logic = 19:01

DB query = 19:00

👉 You will get:

duplicate records

missing records

incorrect counts

⚠️ Edge case (know this)
At exactly:

19:00:00 → excluded
19:01:00 → included
So:

1-minute gap exists

this must be intentional (sounds like it is 👍)

🧠 Why people sometimes use 19:01
Usually done to:

avoid overlap with previous cycle

handle boundary issues in upstream systems

avoid duplicate processing at exact cutoff

So your choice actually makes sense 👍

⚡ Final corrected snippet
private boolean isAfter701pmBeforeMidnight(LocalTime localTime) {
    return !localTime.isBefore(LocalTime.of(19, 1))
            && localTime.isBefore(LocalTime.MIDNIGHT);
}
👍 Final verdict
✔ Using 19:01 is fine
✔ Just fix your condition
✔ Keep it consistent across:

cache logic

DB query

closing time

💡 Pro tip (very useful)
Define once:

private static final LocalTime CYCLE_START_TIME = LocalTime.of(19, 1);
Then reuse everywhere:

!localTime.isBefore(CYCLE_START_TIME)
👉 prevents bugs later

If you want, I can next:

align your DAO query + cache + UI into one consistent time model

so you never have cycle mismatch issues (super important in payments systems)


Uploaded image

Good — this is very close now 👍
But there is still one critical bug + one logic improvement you should fix.

🚨 1. CRITICAL BUG (still there)
Your method:
return !localTime.isBefore(LocalTime.of(19, 1)) 
       && localTime.isAfter(LocalTime.MIDNIGHT);
❌ Problem:
localTime.isAfter(LocalTime.MIDNIGHT)
👉 This is almost always TRUE (except exactly 00:00)

So your condition becomes:

time >= 19:01 AND always true
👉 That means:

19:01 → true ✅

23:59 → true ✅

BUT logic is incorrect and misleading

✅ FIX (for your 19:01 requirement)
private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return !localTime.isBefore(LocalTime.of(19, 1))
            && localTime.isBefore(LocalTime.MIDNIGHT);
}
🧠 Even cleaner (recommended)
private static final LocalTime CYCLE_START = LocalTime.of(19, 1);

private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return localTime.compareTo(CYCLE_START) >= 0
            && localTime.compareTo(LocalTime.MIDNIGHT) < 0;
}
⚠️ 2. Method name mismatch
Your method:

isAfter7pmBeforeMidnight
👉 But you are using 19:01, not 19:00

✅ Better naming
isAfterCycleStartBeforeMidnight
or

isWithinCycleWindow
⚠️ 3. Minor improvement (readability)
Instead of:

!localTime.isBefore(...)
👉 Use:

localTime.compareTo(...) >= 0
Cleaner and easier to reason about.

⚠️ 4. Everything else looks good now ✅
👍 What you fixed correctly:
Using EST constant ✔️

Using 19:01 consistently ✔️

Closing time aligned ✔️

Fallback logic ✔️

Cache structure ✔️

⚡ Final corrected method (copy this)
private static final LocalTime CYCLE_START = LocalTime.of(19, 1);

private boolean isWithinCycleWindow(LocalTime localTime) {
    return localTime.compareTo(CYCLE_START) >= 0
            && localTime.compareTo(LocalTime.MIDNIGHT) < 0;
}
🔥 Why this matters (important)
If you keep the current bug:

your cycle logic will silently behave wrong

DB query window will not match

Kendo grid counts will be off

very hard to debug later

👍 Final verdict
Area	Status
Time boundary logic	❌ needs fix
19:01 usage	✅ correct
Closing time	✅ correct
Structure	✅ good
👉 Fix that one line (isAfter(MIDNIGHT) → isBefore(MIDNIGHT))
and your implementation becomes production-ready.

If you want next, I can:

align this with your DB2 query window exactly

so your DAO + cache + UI are perfectly consistent (very important in your system)


Uploaded image

Nice 👍 — this version is almost correct, and I can see you fixed the previous bug.
But there is still one subtle logic issue + one important improvement.

✅ 1. Your condition now (current code)
return !localTime.isBefore(LocalTime.of(19, 1)) 
       && localTime.isBefore(LocalTime.MIDNIGHT);
✔ This is now logically correct
≥ 19:01 ✅

< 00:00 ✅

👉 So your 7:01 PM → midnight window is working 👍

⚠️ 2. Subtle improvement (readability + safety)
Right now:

!localTime.isBefore(...)
👉 This is correct but harder to read and reason about

✅ Better version (recommended)
private static final LocalTime CYCLE_START = LocalTime.of(19, 1);

private boolean isAfter7pmBeforeMidnight(LocalTime localTime) {
    return localTime.compareTo(CYCLE_START) >= 0
            && localTime.compareTo(LocalTime.MIDNIGHT) < 0;
}
👉 Much clearer:

no double negatives

easier to debug later

⚠️ 3. Method name is misleading now
isAfter7pmBeforeMidnight
👉 But you're using 19:01, not 19:00

✅ Better name
isWithinCycleWindow
or

isAfterCycleStartBeforeMidnight
⚠️ 4. Minor but important consistency check
You are using 19:01 in three places:

✔ Condition
LocalTime.of(19, 1)
✔ Closing time
LocalTime.of(19, 1)
✔ Method
isAfter7pmBeforeMidnight(...)
👉 Good — consistent 👍

⚠️ 5. One thing you should double-check (VERY IMPORTANT)
Your DAO query:

WHERE CREATE_TIMESTAMP > ?
👉 Make sure your fromCreateTimestamp uses:

LocalTime.of(19, 1)
NOT 19:00

❗ Otherwise:
your cache uses 19:01

DB query uses 19:00

👉 Result:

duplicate or missing records

incorrect counts in grid

⚠️ 6. Optional improvement (future-proof)
Instead of hardcoding everywhere:

LocalTime.of(19, 1)
✅ Define once
private static final LocalTime CYCLE_START = LocalTime.of(19, 1);
Then reuse:

localTime.compareTo(CYCLE_START) >= 0
and

LocalTime closingTime = CYCLE_START;
👉 Prevents future bugs

⚠️ 7. Optional but important (cache refresh)
You still have:

@PostConstruct
👉 runs only once

If cycle matters daily:
@Scheduled(fixedRate = 300000) // 5 min
public void refreshJob() {
    refreshCycleDateCache();
}
🧠 Final verdict
✅ What’s correct now
time window logic ✔️

19:01 usage ✔️

fallback logic ✔️

timezone ✔️

⚠️ What to improve
Use compareTo instead of !isBefore

Rename method (optional but better)

Define constant for 19:01

Ensure DAO uses same timestamp

👍 Final answer
👉 Your logic is now correct
👉 No functional bug anymore

Just improve readability + consistency and you’re production-ready.

If you want next, I can:

align your DAO query timestamp calculation exactly with this cache

or help you verify your DB2 query returns correct counts for this window 👍


St Augustine grass in Sanford in shade 

Short answer: Yes, St. Augustine can work in shade in Sanford, NC — but it’s NOT the safest choice.

Let me break it down clearly 👇

🌱 St. Augustine in Shade (Sanford, NC)
✅ Pros
It’s actually the most shade-tolerant warm-season grass 

Can grow with partial shade (4–6 hours sunlight) 

Forms a thick, nice-looking lawn

❌ Big Problem (for Sanford)
Sanford is in the NC Piedmont (transition zone).

👉 St. Augustine:

HATES cold ❌ 

Gets winter damage easily ❌ 

Is better suited for coastal NC, not inland areas ❌ 

⚠️ Reality for your yard
If your yard is:
🌤️ Partial shade (4–6 hrs sun)
👉 St. Augustine can work, but:

choose the RIGHT type (important 👇)

expect winter stress

🌳 Heavy shade (<4 hrs sun)
👉 It will struggle
Even though it's “shade tolerant,” it still needs light

🌿 Best St. Augustine types for YOUR situation
Avoid:
❌ Floratam (needs sun)

Choose:

Raleigh → best for NC (cold tolerance) 

Palmetto / Seville → better shade performance 

🧠 Honest recommendation (based on Sanford)
👍 If you want lowest risk:
👉 Go with Tall Fescue

Best overall for Sanford

Handles shade + cold much better

👍 If you REALLY want St. Augustine:
Do it ONLY if:

yard is mostly shade but still gets some sun

you’re okay with:

winter browning

possible patch repair

⚖️ Comparison (for your exact case)
Grass Type	Shade	Cold	Best for Sanford
St. Augustine	⭐⭐⭐⭐	⭐	⚠️ risky
Tall Fescue	⭐⭐⭐	⭐⭐⭐⭐	✅ best
Zoysia	⭐⭐⭐	⭐⭐⭐	👍 good
Bermuda	⭐	⭐⭐⭐	❌ bad in shade
💡 My advice (based on your location)
👉 If your yard is mostly shade in Sanford:

Best choice: Tall fescue

Second option: Zoysia

Only consider St. Augustine if:

you specifically want that look

and accept some risk

👍 Simple answer
👉 Yes, St. Augustine grows in shade
👉 But in Sanford, NC → cold is your biggest enemy, not shade

If you want, tell me:

how many hours of sun your yard gets

trees / direction

I’ll give you the exact best grass type for your yard (no guessing) 👍


Zoysia sod may be expensive and I also have centepede in the sunny area of backyard 

You’re actually in a very common situation in NC 👍 — mixed lawn with:

🌞 Centipede in sunny areas

🌳 Shade areas struggling

Let’s break it down realistically for your yard in Sanford.

🧠 Your situation (important)
You already have centipede (sunny areas) ✔️

Shade areas = problem ❌

Zoysia = expensive 💸

Want something that blends reasonably well

🌱 Key truth (this drives your decision)
👉 Centipede is NOT great in shade

It prefers sun, only tolerates light shade 

It’s less shade tolerant than zoysia or St. Augustine 

👉 Zoysia handles shade better

Works in sun + light shade and forms dense turf 

👉 St. Augustine = best shade (warm-season)

Most shade-tolerant warm-season grass 

⚖️ Now your real decision
Option 1: Stay with Centipede everywhere (cheapest)
👉 Just extend centipede into shade

Reality:
Will survive in light shade

Will thin out in moderate shade

Will look patchy

✔ cheapest
❌ not best looking

Option 2: Mix Centipede (sun) + Zoysia (shade) ⭐ BEST BALANCE
👉 This is honestly the best practical setup for you

Why:
Zoysia handles shade better than centipede

More cold tolerant than St. Augustine

Works in transition zone (Sanford)

Downsides:
💸 sod cost

slightly different texture

Option 3: Use St. Augustine in shade
👉 Works best in shade BUT:

In Sanford:
❌ winter damage risk

❌ may struggle long-term

❌ higher maintenance

✔ best shade
❌ risky in your location

Option 4: Tall Fescue in shade (hybrid lawn)
👉 Very common in NC

cool-season grass

does well in shade 

Downsides:
different color (winter green)

needs reseeding

💡 My honest recommendation (for YOU)
Since you already have centipede:

🥇 Best practical setup
👉 Centipede (sun) + Zoysia (shade transition areas)

keeps warm-season lawn look

handles shade better

avoids St. Augustine risk

🥈 Budget-friendly option
👉 Stick with centipede + improve conditions

trim trees

raise mowing height

overseed thin spots

🥉 If shade is heavy (<3–4 hrs sun)
👉 Nothing warm-season will look great

Then:

use mulch / pine straw / beds

OR small patch of fescue

⚠️ Important warning (people miss this)
👉 Mixing grasses = visible difference

Centipede = light green

Zoysia = darker + thicker

But:
👉 Most people don’t care after a few weeks

👍 Simple answer
👉 You don’t need to replace everything
👉 Just improve shade areas smartly

🧠 What I would do (if it was my yard in Sanford)
Keep centipede where it’s already strong

Add zoysia only where shade causes problems

Avoid St. Augustine (too risky inland)

If you want, tell me:

how many hours of sun your shady area gets

and size of the patch

I’ll tell you exactly which grass + how much sod you need (cost estimate too) 👍


Best time to install sod 

For Sanford, NC (Piedmont / transition zone) and your grasses (centipede + maybe zoysia), timing matters a lot.

🌱 Best time to install sod (for you)
🥇 Ideal window
👉 Late spring to early summer

May → June (BEST)

soil is warm

grass is actively growing

fastest rooting

🥈 Good window
👉 April → early July

still works well

just need good watering

⚠️ Risky window
👉 Mid–late summer (July–August)

heat stress 🔥

heavy watering required

can still work, but harder

❌ Avoid
👉 Fall → Winter (Oct–March)

For warm-season grasses (centipede, zoysia, St. Augustine):

they go dormant

roots don’t establish well

higher failure risk

🌿 Specific to your grasses
🌱 Centipede sod
best: May–June

slower grower → needs warm soil

🌱 Zoysia sod
best: May–July

roots slower than centipede → needs longer warm period

💧 After installation (critical)
For first 2–3 weeks:

Water daily (sometimes twice in heat)

Keep soil consistently moist

Don’t let it dry out

🧠 Local Sanford tip (important)
Sanford summers = hot + humid
👉 So:

If installing in June → perfect

If installing in July/August → expect high watering cost

⚡ My recommendation for YOU
Since you’re planning around:

centipede (existing)

possible zoysia in shade

👉 Target: May or early June

✔ best success
✔ least stress
✔ fastest fill-in

👍 Simple answer
👉 Best time = May–June in Sanford

If you want, I can help you:

calculate how much sod you need

estimate cost for zoysia vs centipede

or give a watering schedule day-by-day 👍


I need to draw a draw.io diagram to demonstrate to my manager a design. 

I have a Fwi app that connects to the Fedwire and FedNow. Fedwire sends a system notification message  when they are shutdown for current cycle date. They also sends a extension notification message with Event Description where it has the minutes and seconds (mm:ss) on how long they extending for. When there is no extension, we know that the Fedwire is shutdown at 7:01 PM. But, when we received an extension, we will change the shutdown time to 7:01 PM + what the extension message event description has. Lets say it had 15:00, the shutdown is determined to be 7:16 PM est. Now, we also have the FedNow sending us a system notification message at around 7:00 PM. We would like to save the System Notification message info in the FedBalance table where we extract the cycle date (for example 2026-04-06) and closing time to be 7:01 PM. But, if we received a extension from Fedwire, we would like to utilize the closing time insert from the Fedwire extension event description.

Use this as the design you show your manager.

Main idea
FWI receives shutdown-related messages from both systems, but the closing time stored in FED_BALANCE follows this rule:

Default closing time = 7:01 PM ET

If Fedwire extension message is received = 7:01 PM ET + extension mm:ss

FedNow system notification provides the cycle date

Fedwire extension can override the closing time

So the saved row is basically:

cycle_date = from system notification context

closing_time = default 7:01 PM ET or extended time from Fedwire

Best diagram shape for draw.io
Make it as 4 sections left to right:

1. External systems
Fedwire

System Notification Message

Extension Notification Message

FedNow

System Notification Message

2. FWI inbound processing
FWI Message Listener

Message Type Router

3. Business logic
Cycle/Closing Time Resolver

FedBalance Updater

4. Database
FED_BALANCE table

Copy this into draw.io as boxes
Box 1
Fedwire

Sends System Notification

Sends Extension Notification

Extension event description contains mm:ss

Box 2
FedNow

Sends System Notification

Used for cycle date context

Box 3
FWI Message Listener

Receives inbound messages from Fedwire/FedNow

Box 4
Message Type Router

Fedwire System Notification

Fedwire Extension Notification

FedNow System Notification

Box 5
Cycle/Closing Time Resolver
Rules:

Default closing time = 7:01 PM ET

If Fedwire extension received:

parse EventDescription (mm:ss)

closing time = 7:01 PM ET + extension

Example:

extension = 15:00

closing time = 7:16 PM ET

Box 6
FedBalance Updater

Build cycle_date

Build closing_time

Insert or update FED_BALANCE

Box 7
FED_BALANCE
Columns:

cycle_date

closing_time

record_type

source_system

last_updated_ts

Arrow flow
Draw these arrows:

Fedwire → FWI Message Listener

FedNow → FWI Message Listener

FWI Message Listener → Message Type Router

Message Type Router → Cycle/Closing Time Resolver

Cycle/Closing Time Resolver → FedBalance Updater

FedBalance Updater → FED_BALANCE

Then add side labels on the router arrows:

Fedwire System Notification

Fedwire Extension Notification

FedNow System Notification

Decision diamonds to add
Add 2 diamonds under the router.

Decision 1
Message from FedNow System Notification?

If yes:

extract/set cycle_date

set default closing_time = 7:01 PM ET

Then continue to updater.

Decision 2
Fedwire Extension Notification received?

If yes:

parse EventDescription mm:ss

compute extended closing time

update existing FED_BALANCE.closing_time

If no:

keep 7:01 PM ET

Recommended manager-friendly wording
Put this note on the diagram:

Closing Time Resolution

FedNow system notification establishes the cycle date.

Default closing time is 7:01 PM ET.

If Fedwire extension notification arrives, FWI parses the extension duration from EventDescription (mm:ss).

FWI updates FED_BALANCE.closing_time to 7:01 PM ET + extension duration.

Example callout box
Add a small example box on the side:

Example

Cycle Date = 2026-04-06

Default closing time = 7:01 PM ET

Fedwire extension event description = 15:00

Final closing time = 7:16 PM ET

Very clean draw.io layout
Arrange like this:

Fedwire ----\
             > FWI Message Listener --> Message Type Router --> [Decision/Resolver] --> FedBalance Updater --> FED_BALANCE
FedNow  ----/
Under the resolver, add two note boxes:

Default Rule: 7:01 PM ET

Override Rule: 7:01 PM ET + Fedwire extension mm:ss

If you want a more technical version
Use these exact process names:

Inbound MQ Listener

Notification Parser

Extension Time Parser

Closing Time Calculator

FedBalance Persistence Service

Then database table:

FED_BALANCE

Best title for the diagram
Use one of these:

FWI Cycle Date and Closing Time Determination

FWI Shutdown Time Resolution for Fedwire and FedNow

FED_BALANCE Closing Time Update Design

Best one:
FWI Cycle Date and Closing Time Determination

Short logic you can put below the diagram
1. Receive FedNow system notification.
2. Save cycle date and default closing time = 7:01 PM ET.
3. Receive Fedwire extension notification, if any.
4. Parse extension duration from EventDescription (mm:ss).
5. Update FED_BALANCE closing_time to 7:01 PM ET + extension duration.
6. If no extension notification arrives, closing time remains 7:01 PM ET.
One thing to confirm in your design
You should decide and show this clearly:

When Fedwire extension arrives, are you:

updating the same FED_BALANCE row, or

inserting a new row

From what you described, it sounds like:
insert initial row, then update closing time on the same row.

That is the cleaner design.

Here is a simple draw.io-ready version you can copy box by box:

[FedNow]
System Notification

[Fedwire]
System Notification
Extension Notification

        |
        v

[FWI Message Listener]

        |
        v

[Message Type Router]

        |
        v

[Cycle / Closing Time Resolver]
- cycle_date from FedNow notification
- default closing_time = 7:01 PM ET
- if Fedwire extension received:
  parse EventDescription mm:ss
  closing_time = 7:01 PM ET + extension

        |
        v

[FedBalance Updater]
- insert or update FED_BALANCE

        |
        v

[FED_BALANCE]
- cycle_date
- closing_time
- record_type
- source_system
- last_updated_ts
If you want, I can turn this into a more polished step-by-step draw.io box layout with exact shapes and connector labels.


Can you create the file please?

Yes 👍 — I’ll give you a ready-to-import draw.io (.drawio XML) file.

👉 Instructions:

Go to https://app.diagrams.net/

Click File → Import From → Device

Paste/save this as a .drawio file and import

📄 Draw.io XML (copy everything below into a file)
Save as: fwi-closing-time-design.drawio

<mxfile host="app.diagrams.net">
  <diagram name="FWI Design">
    <mxGraphModel dx="1000" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Fedwire -->
        <mxCell id="fw" value="Fedwire&#xa;- System Notification&#xa;- Extension Notification (mm:ss)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;" vertex="1" parent="1">
          <mxGeometry x="50" y="100" width="200" height="80" as="geometry"/>
        </mxCell>

        <!-- FedNow -->
        <mxCell id="fn" value="FedNow&#xa;- System Notification" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;" vertex="1" parent="1">
          <mxGeometry x="50" y="220" width="200" height="60" as="geometry"/>
        </mxCell>

        <!-- Listener -->
        <mxCell id="listener" value="FWI Message Listener" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="300" y="160" width="200" height="60" as="geometry"/>
        </mxCell>

        <!-- Router -->
        <mxCell id="router" value="Message Type Router&#xa;- FedNow System Notification&#xa;- Fedwire System Notification&#xa;- Fedwire Extension Notification" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="550" y="150" width="260" height="100" as="geometry"/>
        </mxCell>

        <!-- Resolver -->
        <mxCell id="resolver" value="Cycle / Closing Time Resolver&#xa;&#xa;Default: 7:01 PM ET&#xa;&#xa;If Extension Received:&#xa;Closing Time = 7:01 PM + mm:ss" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;" vertex="1" parent="1">
          <mxGeometry x="850" y="140" width="260" height="120" as="geometry"/>
        </mxCell>

        <!-- Updater -->
        <mxCell id="updater" value="FedBalance Updater&#xa;- Insert or Update&#xa;- cycle_date&#xa;- closing_time" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="1150" y="160" width="220" height="80" as="geometry"/>
        </mxCell>

        <!-- DB -->
        <mxCell id="db" value="FED_BALANCE&#xa;-_



