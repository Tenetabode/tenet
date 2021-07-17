var buildingId = undefined;
const queryString = window.location.search;

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_UPLOAD_BUILDING_PHOTOS_PAGE + queryString, function (employee) {
        const urlParams = new URLSearchParams(queryString);
        buildingId = urlParams.get('buildingId');
        if (!buildingId) {
            swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getBuildingDetails(buildingId, function (building) {
            if (!building) {
                swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
                return;
            }
            wrapUpLoading();
        });
    });

    var homeButtons = document.getElementsByClassName("homeButton");
    for (g = 0; g < homeButtons.length; ++g) {
        homeButtons[g].addEventListener('click', function (event) {
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
        });
    }

    var resetButtons = document.getElementsByClassName("resetButton");
    for (g = 0; g < resetButtons.length; ++g) {
        resetButtons[g].addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById("mainForm").reset();
        });
    }

    var uploadButtons = document.getElementsByClassName("uploadButton");
    for (g = 0; g < uploadButtons.length; ++g) {
        uploadButtons[g].addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Upload Form");
            for (var r = 0; r < uploadButtons.length; ++r) {
                uploadButtons[r].disabled = true;
            }
            var mainForm = document.getElementById("mainForm");
            const formData = new FormData(mainForm);
            const endpoint = CONNECTION_DATA.TENET_UPLOAD_BUILDING_PHOTOS_ENDPOINT + buildingId;
            sendToServer({
                    method: "POST",
                    headers: {
                        "x-employee-access-token": employeeAuthToken,
                    },
                    noHeaderFlag: true
                },
                CONNECTION_DATA.TENET_DOMAIN +
                CONNECTION_DATA.TENET_UPLOAD_BUILDING_PHOTOS_ENDPOINT + buildingId,
                formData,
                function (response1) {
                    var responseObj1 = JSON.parse(response1);
                    document.getElementById("mainForm").reset();
                    for (var r = 0; r < uploadButtons.length; ++r) {
                        uploadButtons[r].disabled = false;
                    }
                    swal("Success", "Images Uploaded successfully!...", "success").then(function(value){
                        window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE+"?buildingId="+buildingId;
                    });
                },
                function (response1) {
                    console.log("ERROR : " + response1);
                    var msg = "Image Upload Failed!....";
                    try {
                        var responseObj1 = JSON.parse(response1);
                        msg = responseObj1.errormessage;
                    } catch (err) {
                        console.log("ERROR 2 : " + err);
                    }
                    for (var r = 0; r < uploadButtons.length; ++r) {
                        uploadButtons[r].disabled = false;
                    }
                    swal("Sorry", msg, "error");
                }
            );
        });
    }

}