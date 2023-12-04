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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6157608695652174, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9975, 500, 1500, "all_task-0"], "isController": false}, {"data": [0.3225, 500, 1500, "sbu"], "isController": false}, {"data": [0.6825, 500, 1500, "all_task-1"], "isController": false}, {"data": [0.6375, 500, 1500, "sbu-1"], "isController": false}, {"data": [0.715, 500, 1500, "all_task-2"], "isController": false}, {"data": [0.37, 500, 1500, "Dashboard"], "isController": false}, {"data": [0.6275, 500, 1500, "sbu-2"], "isController": false}, {"data": [0.7025, 500, 1500, "login-1"], "isController": false}, {"data": [0.0675, 500, 1500, "login-0"], "isController": false}, {"data": [0.9825, 500, 1500, "sbu-0"], "isController": false}, {"data": [0.04, 500, 1500, "login"], "isController": false}, {"data": [0.46, 500, 1500, "all_task"], "isController": false}, {"data": [0.395, 500, 1500, "task_create"], "isController": false}, {"data": [0.64, 500, 1500, "report-2"], "isController": false}, {"data": [0.9825, 500, 1500, "Dashboard-0"], "isController": false}, {"data": [0.6475, 500, 1500, "report-1"], "isController": false}, {"data": [0.2825, 500, 1500, "report"], "isController": false}, {"data": [0.6525, 500, 1500, "task_create-2"], "isController": false}, {"data": [0.6175, 500, 1500, "task_create-1"], "isController": false}, {"data": [0.9925, 500, 1500, "task_create-0"], "isController": false}, {"data": [0.7125, 500, 1500, "Dashboard-1"], "isController": false}, {"data": [0.9775, 500, 1500, "report-0"], "isController": false}, {"data": [0.6575, 500, 1500, "Dashboard-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4600, 0, 0.0, 1014.335000000003, 5, 12221, 668.0, 1749.800000000001, 3949.95, 8558.06999999998, 6.10784326743059, 19.877461394447174, 1.142108600108879], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["all_task-0", 200, 0, 0.0, 24.934999999999985, 5, 878, 8.0, 18.0, 207.59999999999786, 442.95000000000186, 0.26772077258860555, 0.13281460202637851, 0.03320365050659463], "isController": false}, {"data": ["sbu", 200, 0, 0.0, 1338.6700000000003, 342, 3116, 1449.0, 1784.5, 2005.849999999999, 2955.6300000000047, 0.2676842236287541, 1.7370719394658896, 0.10038158386078279], "isController": false}, {"data": ["all_task-1", 200, 0, 0.0, 551.005, 173, 1049, 569.5, 784.9, 828.8, 1024.1500000000008, 0.26766129604276157, 0.41064052351872893, 0.034764601927428994], "isController": false}, {"data": ["sbu-1", 200, 0, 0.0, 644.9750000000003, 161, 1392, 711.5, 880.3000000000001, 956.2999999999998, 1113.7300000000002, 0.26808249970846026, 0.41128672562694446, 0.03455750972804371], "isController": false}, {"data": ["all_task-2", 200, 0, 0.0, 524.8800000000001, 162, 1058, 534.0, 790.5, 870.0499999999997, 1005.8900000000001, 0.2676928224861971, 1.1941609503095199, 0.03293876526685628], "isController": false}, {"data": ["Dashboard", 200, 0, 0.0, 1281.4549999999997, 343, 4056, 1349.5, 1914.3000000000002, 2229.3999999999996, 3148.140000000001, 0.2684293527497232, 1.7450529309129952, 0.103806663758682], "isController": false}, {"data": ["sbu-2", 200, 0, 0.0, 643.5300000000002, 163, 1664, 684.5, 904.0000000000001, 1033.5999999999995, 1335.4800000000005, 0.26793668656096564, 1.1952488127055576, 0.03296877197918132], "isController": false}, {"data": ["login-1", 200, 0, 0.0, 573.5050000000001, 170, 2543, 580.0, 926.9, 997.0, 1329.95, 0.2690066659851831, 1.200021924043278, 0.03310042960364558], "isController": false}, {"data": ["login-0", 200, 0, 0.0, 4747.134999999999, 610, 11611, 3905.5, 8203.0, 8987.8, 10323.84, 0.2681346143017641, 0.1296158535931379, 0.031422025113487975], "isController": false}, {"data": ["sbu-0", 200, 0, 0.0, 49.85999999999995, 5, 1713, 8.0, 27.900000000000006, 285.54999999999967, 1115.650000000004, 0.2681691289062186, 0.13251326096342442, 0.03299737328338236], "isController": false}, {"data": ["login", 200, 0, 0.0, 5320.7300000000005, 837, 12221, 4570.0, 8854.9, 9614.55, 11168.41, 0.26779461759598094, 1.3240665516488783, 0.06433347258653448], "isController": false}, {"data": ["all_task", 200, 0, 0.0, 1101.1500000000003, 364, 2336, 1131.0, 1571.1000000000001, 1721.8499999999997, 2141.630000000002, 0.26758967264417394, 1.7369810098299066, 0.10086876332094839], "isController": false}, {"data": ["task_create", 200, 0, 0.0, 1258.0799999999988, 358, 2410, 1304.0, 1628.7, 1764.7999999999997, 2251.5600000000004, 0.2675961171803397, 1.7406813833381278, 0.10452973327357021], "isController": false}, {"data": ["report-2", 200, 0, 0.0, 657.6549999999999, 160, 1658, 716.0, 901.7, 978.95, 1386.9900000000018, 0.268052677712224, 1.1957662419818744, 0.032983044327871316], "isController": false}, {"data": ["Dashboard-0", 200, 0, 0.0, 61.269999999999946, 5, 2179, 8.0, 16.900000000000006, 460.89999999999975, 1055.6600000000003, 0.2690743438958467, 0.1361137794316881, 0.03468536464282399], "isController": false}, {"data": ["report-1", 200, 0, 0.0, 634.8750000000006, 165, 1803, 707.5, 876.7, 966.4999999999999, 1329.4600000000023, 0.2682565337231995, 0.41155372507729143, 0.03536585161389837], "isController": false}, {"data": ["report", 200, 0, 0.0, 1365.6400000000003, 333, 4143, 1495.0, 1793.8000000000002, 2070.65, 3101.8, 0.2679682779152604, 1.7404853675921845, 0.10205823084663238], "isController": false}, {"data": ["task_create-2", 200, 0, 0.0, 604.655, 169, 1958, 625.0, 823.5, 889.4499999999998, 1025.8000000000002, 0.2676559229579191, 1.1939963438200925, 0.03293422489521271], "isController": false}, {"data": ["task_create-1", 200, 0, 0.0, 623.37, 160, 1127, 645.5, 811.8, 876.8, 1066.8000000000002, 0.26779246619454855, 0.4108417621012068, 0.036612251237535934], "isController": false}, {"data": ["task_create-0", 200, 0, 0.0, 29.759999999999977, 5, 975, 8.5, 17.900000000000006, 32.499999999999886, 842.5900000000031, 0.267991976320229, 0.13661309730386673, 0.03506926252627996], "isController": false}, {"data": ["Dashboard-1", 200, 0, 0.0, 560.7050000000004, 161, 1807, 571.5, 856.3000000000001, 914.55, 1272.2900000000006, 0.2687641017164619, 0.41233242558257976, 0.03622016214538256], "isController": false}, {"data": ["report-0", 200, 0, 0.0, 72.76999999999998, 5, 2160, 8.5, 209.70000000000115, 423.84999999999997, 1375.8900000000037, 0.2685551464565491, 0.13427757322827455, 0.03383165419228011], "isController": false}, {"data": ["Dashboard-2", 200, 0, 0.0, 659.0950000000001, 164, 2571, 701.0, 956.1, 1139.849999999999, 2072.8600000000047, 0.2684952986473207, 1.197740746309532, 0.03303750745074453], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
