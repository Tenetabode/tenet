var submitButton = document.getElementById("submitButton");
var cancelButton = document.getElementById("cancelButton");

var fieldsToSend = {
    "managementUserId": null,
    "pType": null,
    "pId": null,
    "designation": null,
};

function readDataToSend() {
    var dataToSend = {};
    var fields = Object.keys(fieldsToSend);
    for (i = 0; i < fields.length; ++i) {
        var element = document.getElementById(fields[i]);
        if (element) {
            dataToSend[fields[i]] = element.value;
        }
    }
    return JSON.stringify(dataToSend);
}

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_NEW_PERMISSION_PAGE, function (employee) {
        wrapUpLoading();
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, {});
    });

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            var dataToSend = readDataToSend();
            sendToServer({
                method: "POST",
                headers: {
                    "x-employee-access-token": employeeAuthToken
                }
            }, CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_NEW_PERMISSION_ENDPOINT, dataToSend, function (response) {
                var responseObj = JSON.parse(response);
                swal("Success", "New Permission Added Successfully", "success").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
            }, function (response) {
                console.log("ERROR : " + response);
                var responseObj = JSON.parse(response);
                markInvalidFields(responseObj.invalidInputs);
                swal("Sorry!..", responseObj.errormessage, "error");
                submitButton.disabled = false;
            });
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", function (event) {
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
        });
    }

}