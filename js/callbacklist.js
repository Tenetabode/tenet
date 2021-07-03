window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_CALLBACK_LIST_PAGE, function (employee) {
        getAllCallBackRecordsList(function (callBackRecordsList) {
            wrapUpLoading();
            var data = [];
            if (callBackRecordsList) {
                data = callBackRecordsList;
            }
            var table = new Tabulator("#example-table", {
                maxHeight: "100%",
                data: data, //load row data from array
                layout: "fitColumns", //fit columns to width of table
                responsiveLayout: "collapse", //responsiveLayout:"hide",  //hide columns that dont fit on the table
                tooltips: true, //show tool tips on cells
                //addRowPos:"top",          //when adding a new row, add it to the top of the table
                history: true, //allow undo and redo actions on the table
                pagination: "local", //paginate the data
                paginationSize: 25, //allow 7 rows per page of data
                movableColumns: true, //allow column order to be changed
                //resizableRows:true,       //allow row order to be changed
                initialSort: [ //set the initial sort order of the data
                    {
                        column: "callBackId",
                        dir: "des"
                    },
                ],
                columns: [ //define the table columns
                    {
                        formatter: "responsiveCollapse",
                        width: 30,
                        minWidth: 30,
                        hozAlign: "left",
                        resizable: false,
                        headerSort: false
                    },
                    {
                        "title": "callBackId",
                        "field": "callBackId",
                        "hozAlign": "left"
                    }, {
                        "title": "managementUserId",
                        "field": "managementUserId",
                        "hozAlign": "left"
                    }, {
                        "title": "buildingId",
                        "field": "buildingId",
                        "hozAlign": "left"
                    }, {
                        "title": "apartmentId",
                        "field": "apartmentId",
                        "hozAlign": "left"
                    }, {
                        "title": "tenantName",
                        "field": "tenantName",
                        "hozAlign": "left"
                    }, {
                        "title": "tenantPhoneNumber",
                        "field": "tenantPhoneNumber",
                        "hozAlign": "left"
                    }, {
                        "title": "subject",
                        "field": "subject",
                        "hozAlign": "left"
                    }, {
                        "title": "remarks",
                        "field": "remarks",
                        "hozAlign": "left"
                    }, {
                        "title": "rentOrBuy",
                        "field": "rentOrBuy",
                        "hozAlign": "left"
                    }, {
                        "title": "amount",
                        "field": "amount",
                        "hozAlign": "left"
                    }, {
                        "title": "preference",
                        "field": "preference",
                        "hozAlign": "left"
                    }, {
                        "title": "deposit",
                        "field": "deposit",
                        "hozAlign": "left"
                    }, {
                        "title": "Date",
                        "field": "createDate",
                        "hozAlign": "left"
                    },
                ],
            });
        });
    });

}