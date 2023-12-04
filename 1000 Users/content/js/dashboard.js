/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6347826086956522, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9983333333333333, 500, 1500, "all_task-0"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "sbu"], "isController": false}, {"data": [0.7033333333333334, 500, 1500, "all_task-1"], "isController": false}, {"data": [0.6516666666666666, 500, 1500, "sbu-1"], "isController": false}, {"data": [0.745, 500, 1500, "all_task-2"], "isController": false}, {"data": [0.4116666666666667, 500, 1500, "Dashboard"], "isController": false}, {"data": [0.6433333333333333, 500, 1500, "sbu-2"], "isController": false}, {"data": [0.7216666666666667, 500, 1500, "login-1"], "isController": false}, {"data": [0.09166666666666666, 500, 1500, "login-0"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "sbu-0"], "isController": false}, {"data": [0.07333333333333333, 500, 1500, "login"], "isController": false}, {"data": [0.48, 500, 1500, "all_task"], "isController": false}, {"data": [0.43166666666666664, 500, 1500, "task_create"], "isController": false}, {"data": [0.655, 500, 1500, "report-2"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "Dashboard-0"], "isController": false}, {"data": [0.665, 500, 1500, "report-1"], "isController": false}, {"data": [0.325, 500, 1500, "report"], "isController": false}, {"data": [0.665, 500, 1500, "task_create-2"], "isController": false}, {"data": [0.6266666666666667, 500, 1500, "task_create-1"], "isController": false}, {"data": [0.995, 500, 1500, "task_create-0"], "isController": false}, {"data": [0.715, 500, 1500, "Dashboard-1"], "isController": false}, {"data": [0.985, 500, 1500, "report-0"], "isController": false}, {"data": [0.6816666666666666, 500, 1500, "Dashboard-2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6900, 0, 0.0, 921.5669565217405, 5, 12221, 642.0, 1693.800000000001, 3482.9999999999964, 7918.959999999999, 7.314420432886482, 23.804165138412156, 1.3677270544510898], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["all_task-0", 300, 0, 0.0, 19.613333333333316, 5, 878, 8.0, 16.0, 23.0, 239.96000000000004, 0.3201178033516334, 0.15880844150647438, 0.039702110376618596], "isController": false}, {"data": ["sbu", 300, 0, 0.0, 1281.3599999999997, 342, 3116, 1422.5, 1714.9, 1835.2999999999997, 2422.870000000001, 0.3200570128225508, 2.0769324709041506, 0.12002137980845655], "isController": false}, {"data": ["all_task-1", 300, 0, 0.0, 540.1666666666665, 173, 1049, 547.0, 779.9000000000003, 824.9, 939.94, 0.32003481978839293, 0.49099091981207554, 0.041567022492047134], "isController": false}, {"data": ["sbu-1", 300, 0, 0.0, 621.6066666666665, 161, 1392, 702.5, 847.9000000000001, 910.75, 1086.6700000000003, 0.32045187987754464, 0.491630764929319, 0.04130825014046474], "isController": false}, {"data": ["all_task-2", 300, 0, 0.0, 509.45666666666637, 162, 1058, 508.0, 794.6000000000001, 851.8499999999999, 999.95, 0.3200556470084932, 1.4277482378269502, 0.03938184719049819], "isController": false}, {"data": ["Dashboard", 300, 0, 0.0, 1209.2833333333335, 343, 4056, 1260.5, 1833.9000000000003, 2008.75, 3061.7700000000013, 0.320680355442106, 2.0847354747833005, 0.12401310620612692], "isController": false}, {"data": ["sbu-2", 300, 0, 0.0, 623.0599999999993, 163, 1664, 679.5, 859.0, 945.95, 1282.820000000001, 0.3202975778029508, 1.4288274759803508, 0.03941161601872246], "isController": false}, {"data": ["login-1", 300, 0, 0.0, 556.3066666666666, 170, 2543, 541.0, 908.9000000000001, 975.4499999999998, 1324.4600000000005, 0.3212469521695413, 1.4330625756938131, 0.039528433567736526], "isController": false}, {"data": ["login-0", 300, 0, 0.0, 3968.123333333334, 24, 11611, 3415.0, 7704.900000000003, 8614.699999999997, 10204.280000000004, 0.32039404195239585, 0.1548779792640976, 0.03754617679129639], "isController": false}, {"data": ["sbu-0", 300, 0, 0.0, 36.40666666666665, 5, 1713, 8.0, 21.0, 224.84999999999997, 683.940000000001, 0.32049193375218066, 0.15836808445176115, 0.039435530910912855], "isController": false}, {"data": ["login", 300, 0, 0.0, 4524.536666666669, 232, 12221, 4119.0, 8563.5, 9221.15, 11103.850000000006, 0.320093552675662, 1.582650055856325, 0.07689747456856724], "isController": false}, {"data": ["all_task", 300, 0, 0.0, 1069.5300000000007, 364, 2336, 1078.5, 1561.3000000000006, 1664.9999999999998, 1906.7200000000003, 0.3199573390214638, 2.0769105785895214, 0.12060891881082522], "isController": false}, {"data": ["task_create", 300, 0, 0.0, 1217.2566666666653, 358, 2410, 1288.5, 1600.9, 1729.8, 2204.6900000000032, 0.3200003413336974, 2.0815647203357015, 0.12500013333347557], "isController": false}, {"data": ["report-2", 300, 0, 0.0, 631.5133333333332, 160, 1658, 706.0, 886.8000000000001, 972.75, 1200.8700000000001, 0.3203783026998279, 1.4291875847000137, 0.03942154896501789], "isController": false}, {"data": ["Dashboard-0", 300, 0, 0.0, 43.85999999999999, 5, 2179, 8.0, 14.0, 234.99999999999977, 1021.4500000000005, 0.3213102604005454, 0.16253780750730712, 0.0414189007547578], "isController": false}, {"data": ["report-1", 300, 0, 0.0, 612.8466666666667, 165, 1803, 704.5, 868.7, 945.1499999999999, 1077.91, 0.32051555996205094, 0.4917284616214669, 0.04225546933093446], "isController": false}, {"data": ["report", 300, 0, 0.0, 1296.8533333333337, 333, 4143, 1450.5, 1736.7, 1882.95, 3080.0700000000015, 0.3202979197717771, 2.080372523830165, 0.12198846553807914], "isController": false}, {"data": ["task_create-2", 300, 0, 0.0, 583.9633333333335, 169, 1958, 601.5, 802.9000000000001, 865.6999999999999, 1005.97, 0.3200573542778866, 1.4277558538490098, 0.039382057264661825], "isController": false}, {"data": ["task_create-1", 300, 0, 0.0, 609.8199999999998, 160, 1127, 651.0, 806.5000000000002, 867.8499999999999, 1046.6300000000003, 0.320180667277856, 0.49121467606788255, 0.043774700604394375], "isController": false}, {"data": ["task_create-0", 300, 0, 0.0, 23.209999999999987, 5, 975, 8.0, 16.900000000000034, 21.94999999999999, 504.60000000000036, 0.3203505916875428, 0.16330371959072007, 0.04192087820911205], "isController": false}, {"data": ["Dashboard-1", 300, 0, 0.0, 550.3300000000003, 161, 1807, 563.0, 856.5000000000002, 910.0, 1201.6300000000003, 0.3209664943076592, 0.4924202759348951, 0.043255250209430635], "isController": false}, {"data": ["report-0", 300, 0, 0.0, 52.19999999999997, 5, 2160, 8.0, 23.0, 348.7999999999993, 968.4300000000005, 0.3207986603447944, 0.1603993301723972, 0.04041311248484226], "isController": false}, {"data": ["Dashboard-2", 300, 0, 0.0, 614.7366666666667, 164, 2571, 678.5, 914.9000000000001, 1027.4499999999996, 1563.1500000000008, 0.3207430976085395, 1.430814911988094, 0.03946643583855076], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
