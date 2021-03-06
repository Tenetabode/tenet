var builderId = undefined;
const queryString = window.location.search;
var submitButton = document.getElementById("submitButton");
var cancelButton = document.getElementById("cancelButton");

function nearByPlaceElementsGroup() {
    return "<div class=\"row\"><div class=\"input-field col s12 m6 l4\"><input class=\"placename\" placeholder=\"Location Name\" type=\"text\"><label>Location Name</label></div><div class=\"input-field col s12 m6 l4\"><input class=\"distance\" placeholder=\"Distance\" type=\"text\"><label>Distance</label></div><div class=\"input-field col s12 m6 l4\"><input class=\"time\" placeholder=\"Time\" type=\"text\"><label>Time</label></div></div>";
}

function add(buttonNode) {
    var parentNode = buttonNode.parentNode;
    var siblingNode = parentNode.previousElementSibling;
    siblingNode.innerHTML += nearByPlaceElementsGroup();
}

const getBuilderId = function () {
    return builderId;
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

const readFromCheckBox = function (fieldName) {
    var checkboxes = document.querySelectorAll("input[name=\"" + fieldName + "\"]:checked");
    if (checkboxes.length <= 0) {
        return undefined;
    }
    var data = [];
    checkboxes.forEach((checkbox) => {
        data.push(checkbox.value);
    });
    return data;
}

const convertForNearBySchema = function (fieldName) {
    var g = 0;
    var elementsList = document.querySelectorAll("." + fieldName + " .placename");
    var max = elementsList.length;
    var data = [];
    for (g = 0; g < max; ++g) {
        data.push({
            "name": elementsList[g].value
        });
    }
    elementsList = document.querySelectorAll("." + fieldName + " .distance");
    for (g = 0; g < elementsList.length && g < max; ++g) {
        data[g]["distance"] = elementsList[g].value;
    }
    elementsList = document.querySelectorAll("." + fieldName + " .time");
    for (g = 0; g < elementsList.length && g < max; ++g) {
        data[g]["timeToReach"] = elementsList[g].value;
    }
    var dataOfNearByPlace = [];
    for (g = 0; g < data.length; ++g) {
        if ((data[g].name && data[g].name.trim().length > 0) || (data[g].distance && data[g].distance.trim().length > 0) || (data[g].timeToReach && data[g].timeToReach.trim().length > 0)) {
            dataOfNearByPlace.push(data[g]);
        }
    }
    return dataOfNearByPlace;
}

const fieldsToSend = {
    "name": noChange,
    "photoLinks": noChange,
    "videoLinks": noChange,
    "mainCity": noChange,
    "region": noChange,
    "locality": noChange,
    "mapLink": noChange,
    "description": noChange,
    "shortDescription": noChange,
    "guidedVisitTiming": noChange,
    "amenities": readFromCheckBox,
    "builderId": getBuilderId,
    "status": noChange,
    "featured": noChange,
    "yearOfCompletion": noChange,
    "towers": noChange,
    "noOfUnits": noChange,
    "area": noChange,
    "configuration": readFromCheckBox,
    "class": noChange,
    "category": noChange,
    "parkingNo": noChange,
    "parkingType": noChange,
    "nearByEducationalInstitutes": convertForNearBySchema,
    "nearByTransitLocations": convertForNearBySchema,
    "nearByHospitals": convertForNearBySchema,
    "nearByUtiliyCenters": convertForNearBySchema,
    "nearByOtherPlaces": convertForNearBySchema,
    "maintenanceFee": noChange,
    "presidentName": noChange,
    "presidentPhoneNumber": noChange,
    "secretaryName": noChange,
    "secretaryPhoneNumber": noChange,
    "careTakerName": noChange,
    "careTakerPhoneNumber": noChange,
    "registeredEmailId": noChange,
    "registeredPhoneNumber": noChange,
    "photoLinksInterior": noChange,
    "photoLinksAmenities": noChange,
    "towerName": noChange,
    "contactNumber": noChange,
    "projectType": noChange,
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

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
});

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_NEW_BUILDING_PAGE + queryString, function (employee) {
        const urlParams = new URLSearchParams(queryString);
        builderId = urlParams.get('builderId');
        if (!builderId) {
            swal("Sorry", "Invalid Builder Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getBuilderDetails(builderId, function (builder) {
            if (!builder) {
                swal("Sorry", "Invalid Builder Id!....", "error").then((value) => {
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
            }, CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_ADD_BUILDING_ENDPOINT, dataToSend, function (response) {
                var responseObj = JSON.parse(response);
                swal("Success", "New Building Added Successfully", "success").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDER_DETAILS_PAGE + "?builderId=" + builderId;
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
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDER_DETAILS_PAGE + "?builderId=" + builderId;
        });
    }

}