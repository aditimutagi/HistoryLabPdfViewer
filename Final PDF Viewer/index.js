/*
Copyright 2019 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/


/* Control the viewer customization. */
var viewerConfig = {
    showAnnotationTools: true,
    enableFormFilling: true,
    enableSearchAPIs: true
};

/* Wait for Adobe Document Services PDF Embed API to be ready */
document.addEventListener("adobe_dc_view_sdk.ready", function () {
    /* Initialize the AdobeDC View object */
    var adobeDCView = new AdobeDC.View({
        /* Pass your registered client id */
        clientId: "bb347a5844674b24a65a607e68941c1e",
        /* Pass the div id in which PDF should be rendered */
        divId: "adobe-dc-view",
    });

    /* Invoke the file preview API on Adobe DC View object */
	var previewFilePromise = adobeDCView.previewFile({
 		content: {
   			location: {
     				url: "https://en.wikipedia.org/api/rest_v1/page/pdf/New_Horizons", 
    			}
  		},
 		metaData: {
   			fileName: "New Horizons"
 		}
	}, viewerConfig);

	previewFilePromise.then(adobeViewer => {
   		adobeViewer.getAPIs().then(apis => {
			str = window.location.search.substring(1);
			var search_string = str.substring(12, str.indexOf("&"))
			var page_number = str.substring(str.lastIndexOf("=") + 1);
			
			apis.search(search_string)
                        	.then(searchObject => console.log(searchObject))
                        	.catch(error => console.log(error));
			apis.gotoLocation(parseInt(page_number))
                        	.then(() => console.log("Success"))
                        	.catch(error => console.log(error));

			
    		});
	})



    /* Define Save API Handler */
    var saveApiHandler = function (metaData, content, options) {
        console.log(metaData, content, options);
        return new Promise(function (resolve, reject) {
            /* Dummy implementation of Save API, replace with your business logic */
            setTimeout(function () {
                var response = {
                    code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: {
                        metaData: Object.assign(metaData, {updatedAt: new Date().getTime()})
                    },
                };
                resolve(response);
            }, 2000);
        });
    };


	var setUserSettingHandler = function (setting) {
        return new Promise(function (resolve, reject) {
            /* This is an example code, where the user preferences are saved in the local storage of the website domain. 
            Replace this with your own custom implementation of saving the preferences. */
            console.log("Setting user preferences in local storage of website domain.")
            localStorage.setItem("USER_SETTINGS", JSON.stringify(setting));
            var response = {
                code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
            };
            resolve(response);
        });
    };

    adobeDCView.registerCallback(
        AdobeDC.View.Enum.CallbackType.SET_USER_SETTING_API,
        setUserSettingHandler,
        {}
    );

    /* Handler to fetch the user preferences */
    var getUserSettingHandler = function () {
        return new Promise(function (resolve, reject) {
            /* This is an example code to fetch the user preferences. Replace with your own custom implementation. */ 
            console.log("Fetching user preferences from local storage of website domain.")
            var userSettings = localStorage.getItem("USER_SETTINGS") || "{}";
            userSettings = JSON.parse(userSettings);
            var response = {
                code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                data: {
                    setting: userSettings
                }
            };
            resolve(response);
        });
    };

    adobeDCView.registerCallback(
        AdobeDC.View.Enum.CallbackType.GET_USER_SETTING_API,
        getUserSettingHandler,
        {},
	AdobeDC.View.Enum.CallbackType.SAVE_API,
        saveApiHandler,
        {}
    );
});