var buildingId = undefined;
const queryString = window.location.search;
var submitButton = document.getElementById("submitButton");
var cancelButton = document.getElementById("cancelButton");

function pricingPreferenceElementsGroup() {
    return "<div class=\"row\"><div class=\"input-field col s12 m6 l4\"><input class=\"pricingPreference\" placeholder=\"Preference\" type=\"text\"><label>Preference</label></div><div class=\"input-field col s12 m6 l4\"><input class=\"pricingRent\" placeholder=\"Rent\" type=\"text\"><label>Rent</label></div><div class=\"input-field col s12 m6 l4\"><input class=\"pricingDeposit\" placeholder=\"Deposit\" type=\"text\"><label>Deposit</label></div></div>";
}

const getBuildingId = function () {
    return buildingId;
}

const noChange = function (fieldName) {
    var element = document.getElementById(fieldName);
    if (!element) {
        return undefined;
    }
    var value = element.value;
    if (!value) {
        value = "";
    }
    return value.trim();
}

const fieldsToSend = {
    "buildingId": getBuildingId,
    "towerLabel": noChange,
    "maintenanceFee": noChange,
    "contactNumber": noChange,
};

function readDataToSend() {
    var dataToSend = {};
    var fieldNamesToSend = Object.keys(fieldsToSend);
    var i = 0;
    for (i = 0; i < fieldNamesToSend.length; ++i) {
        dataToSend[fieldNamesToSend[i]] = fieldsToSend[fieldNamesToSend[i]](fieldNamesToSend[i]);
    }
    return JSON.stringify(dataToSend);
}

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_NEW_TOWER_PAGE + queryString, function (employee) {
        const urlParams = new URLSearchParams(queryString);
        buildingId = urlParams.get('buildingId');
        if (!buildingId) {
            swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getBuildingDetails(buildingId, function (builder) {
            if (!builder) {
                swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
                return;
            }
            wrapUpLoading();
        });
    });

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            var dataToSend = readDataToSend();
            console.log(dataToSend);
            sendToServer({
                method: "POST",
                headers: {
                    "x-employee-access-token": employeeAuthToken
                }
            }, CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_NEW_TOWER_ENDPOINT, dataToSend, function (response) {
                var responseObj = JSON.parse(response);
                swal("Success", "New Tower Added Successfully", "success").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE + "?buildingId=" + buildingId;
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
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE + "?buildingId=" + buildingId;
        });
    }

}