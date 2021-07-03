window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_MANAGEMENT_USERS_LIST_PAGE, function (employee) {
        getAllManagementUsersList(function (allManagementUsersList) {
            wrapUpLoading();
            var data = [];
            if (allManagementUsersList) {
                data = allManagementUsersList;
            }
            var table = new Tabulator("#example-table", {
                maxHeight:"100%",
                data:data,           //load row data from array
                layout:"fitColumns",      //fit columns to width of table
                responsiveLayout:"collapse",//responsiveLayout:"hide",  //hide columns that dont fit on the table
                tooltips:true,            //show tool tips on cells
                //addRowPos:"top",          //when adding a new row, add it to the top of the table
                history:true,             //allow undo and redo actions on the table
                pagination:"local",       //paginate the data
                paginationSize:25,         //allow 7 rows per page of data
                movableColumns:true,      //allow column order to be changed
                //resizableRows:true,       //allow row order to be changed
                initialSort:[             //set the initial sort order of the data
                    {column:"managementUserId", dir:"asc"},
                ],
                columns:[                 //define the table columns
                    {formatter:"responsiveCollapse", width:30, minWidth:30, hozAlign:"center", resizable:false, headerSort:false},
                    {title:"Id", field:"managementUserId"},
                    {title:"Name", field:"name"},
                    {title:"Email Id", field:"emailId", hozAlign:"left"},
                    {title:"Phone Number", field:"phoneNumber", hozAlign:"center"},
                    {title:"Building Id", field:"buildingId", hozAlign:"center"},
                    {title:"Designation", field:"designation"},
                ],
            });
        });
    });

}