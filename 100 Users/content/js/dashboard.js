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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6145652173913043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "all_task-0"], "isController": false}, {"data": [0.325, 500, 1500, "sbu"], "isController": false}, {"data": [0.7, 500, 1500, "all_task-1"], "isController": false}, {"data": [0.635, 500, 1500, "sbu-1"], "isController": false}, {"data": [0.745, 500, 1500, "all_task-2"], "isController": false}, {"data": [0.4, 500, 1500, "Dashboard"], "isController": false}, {"data": [0.62, 500, 1500, "sbu-2"], "isController": false}, {"data": [0.72, 500, 1500, "login-1"], "isController": false}, {"data": [0.01, 500, 1500, "login-0"], "isController": false}, {"data": [0.965, 500, 1500, "sbu-0"], "isController": false}, {"data": [0.01, 500, 1500, "login"], "isController": false}, {"data": [0.435, 500, 1500, "all_task"], "isController": false}, {"data": [0.405, 500, 1500, "task_create"], "isController": false}, {"data": [0.64, 500, 1500, "report-2"], "isController": false}, {"data": [0.965, 500, 1500, "Dashboard-0"], "isController": false}, {"data": [0.66, 500, 1500, "report-1"], "isController": false}, {"data": [0.3, 500, 1500, "report"], "isController": false}, {"data": [0.65, 500, 1500, "task_create-2"], "isController": false}, {"data": [0.61, 500, 1500, "task_create-1"], "isController": false}, {"data": [0.985, 500, 1500, "task_create-0"], "isController": false}, {"data": [0.735, 500, 1500, "Dashboard-1"], "isController": false}, {"data": [0.955, 500, 1500, "report-0"], "isController": false}, {"data": [0.67, 500, 1500, "Dashboard-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2300, 0, 0.0, 1188.8460869565215, 5, 12221, 649.5, 2086.2000000000007, 7140.849999999996, 9212.53999999999, 117.76150734729404, 383.24490553479086, 22.020281859607806], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["all_task-0", 100, 0, 0.0, 41.94, 6, 878, 10.0, 198.20000000000107, 234.95, 873.6699999999978, 7.4632435256362415, 3.7024684677961046, 0.9256171169490262], "isController": false}, {"data": ["sbu", 100, 0, 0.0, 1373.39, 342, 3116, 1475.5, 2001.7000000000005, 2205.2499999999986, 3114.4499999999994, 7.280669821623589, 47.24614352020386, 2.7302511831088463], "isController": false}, {"data": ["all_task-1", 100, 0, 0.0, 536.4899999999998, 173, 1049, 552.0, 803.5000000000001, 892.5499999999995, 1048.7599999999998, 7.37517516041006, 11.314843922855669, 0.9579084925141973], "isController": false}, {"data": ["sbu-1", 100, 0, 0.0, 638.9800000000001, 161, 1392, 699.5, 942.5, 1025.0, 1389.2199999999984, 8.061265618702135, 12.367429967754939, 1.0391475211608223], "isController": false}, {"data": ["all_task-2", 100, 0, 0.0, 532.9099999999999, 171, 1058, 524.0, 848.7, 886.9, 1057.4799999999998, 7.39316871211001, 32.98046355167825, 0.9097063063729114], "isController": false}, {"data": ["Dashboard", 100, 0, 0.0, 1305.9699999999998, 343, 4056, 1350.5, 2228.8, 2593.3499999999976, 4046.9299999999953, 8.631851532153647, 56.11546450151057, 3.338098834700043], "isController": false}, {"data": ["sbu-2", 100, 0, 0.0, 641.9599999999999, 163, 1664, 682.5, 983.7000000000003, 1144.2499999999998, 1660.7199999999984, 7.674008134448623, 34.233270662266904, 0.9442627196684829], "isController": false}, {"data": ["login-1", 100, 0, 0.0, 576.5000000000001, 170, 2543, 582.0, 997.0, 1247.449999999999, 2530.8699999999935, 10.903936321011885, 48.64177843201396, 1.3416952894995093], "isController": false}, {"data": ["login-0", 100, 0, 0.0, 6626.450000000001, 686, 11611, 7062.0, 8980.6, 9495.199999999999, 11598.139999999994, 8.557247989046722, 4.136560307205203, 1.0028024987164128], "isController": false}, {"data": ["sbu-0", 100, 0, 0.0, 92.01999999999995, 6, 1713, 11.0, 284.10000000000014, 544.4999999999997, 1707.069999999997, 8.108984755108661, 4.006978795004865, 0.9977852335387609], "isController": false}, {"data": ["login", 100, 0, 0.0, 7202.78, 903, 12221, 7708.5, 9613.1, 10407.0, 12210.479999999994, 7.977026164645819, 39.441097140236124, 1.9163558950223358], "isController": false}, {"data": ["all_task", 100, 0, 0.0, 1111.7600000000002, 386, 2336, 1132.0, 1694.6000000000004, 1835.0, 2334.079999999999, 7.239032865209208, 46.99008931156798, 2.7287760605183147], "isController": false}, {"data": ["task_create", 100, 0, 0.0, 1258.6899999999996, 358, 2410, 1296.0, 1741.1000000000001, 1846.9499999999998, 2408.419999999999, 7.274314395868189, 47.318562686404306, 2.8415290608860113], "isController": false}, {"data": ["report-2", 100, 0, 0.0, 655.1800000000001, 160, 1658, 715.5, 978.4000000000001, 1093.6999999999994, 1655.3099999999986, 8.080808080808081, 36.0479797979798, 0.9943181818181818], "isController": false}, {"data": ["Dashboard-0", 100, 0, 0.0, 114.25999999999996, 5, 2179, 9.0, 459.8000000000001, 934.4999999999965, 2167.769999999994, 10.300782859497321, 5.210747579316028, 1.3278352904820767], "isController": false}, {"data": ["report-1", 100, 0, 0.0, 627.3199999999999, 165, 1803, 712.0, 956.3000000000001, 1063.75, 1798.2899999999977, 8.408307407718826, 12.899854431178003, 1.108517089884806], "isController": false}, {"data": ["report", 100, 0, 0.0, 1420.1499999999996, 333, 4143, 1515.5, 2070.3, 2675.399999999998, 4132.589999999995, 7.9302141157811255, 51.50767000396511, 3.0202963917525776], "isController": false}, {"data": ["task_create-2", 100, 0, 0.0, 592.0600000000004, 169, 1958, 609.0, 844.7, 918.55, 1948.479999999995, 7.363770250368188, 32.84931885125184, 0.9060889175257731], "isController": false}, {"data": ["task_create-1", 100, 0, 0.0, 614.68, 160, 1127, 620.0, 866.1000000000003, 971.8499999999997, 1126.1999999999996, 7.437709185570844, 11.410782354034957, 1.0168743027147638], "isController": false}, {"data": ["task_create-0", 100, 0, 0.0, 51.599999999999994, 5, 975, 10.0, 32.00000000000006, 426.2499999999978, 973.7099999999994, 7.765783955890347, 3.958729711889415, 1.0162256348528382], "isController": false}, {"data": ["Dashboard-1", 100, 0, 0.0, 529.0200000000001, 161, 1807, 535.5, 868.9000000000001, 1012.6499999999992, 1799.6899999999964, 9.28332714444857, 14.242291937430375, 1.2510733847010769], "isController": false}, {"data": ["report-0", 100, 0, 0.0, 137.17000000000004, 5, 2160, 11.0, 423.70000000000005, 874.2499999999993, 2152.199999999996, 8.896005693443643, 4.448002846721822, 1.120688217240459], "isController": false}, {"data": ["Dashboard-2", 100, 0, 0.0, 662.1799999999998, 164, 2571, 723.0, 1056.3, 1437.8999999999987, 2566.0699999999974, 8.77039115944571, 39.12416681283985, 1.0791692246974216], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2300, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
