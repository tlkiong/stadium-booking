(function() {

    'use strict';

    angular.module('Core')
        .service('commonService', commonService);

    commonService.$inject = ['sessionService', '$http', '$q', '$timeout', '$window'];

    function commonService(sessionService, $http, $q, $timeout, $window) {
        var service = this;
        service.isEmpty = isEmpty;
        service.resetForm = resetForm;
        service.http = http;

        /* ======================================== Var ==================================================== */
        service.baseUrl = '';
        service.$q = $q;
        service.$timeout = $timeout;
        service.$window = $window;

        var apiObj = {
        	/*  Example:
        	
        		name: {
					methodType: 'POST' / 'GET' / 'PUT' / 'DELETE',
					url: '....',
                    nextUrlPart: 'get_paired_vehicles' <== This is: http://url/id/nextUrlPart
        		}
        	 */
        }

        /* ======================================== Services =============================================== */
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */
        function http(apiObjKey, headerObj, dataObj, authToken, idOnUrl) {
            var deferred = service.$q.defer();

            var headerObject = (headerObj === undefined || headerObj === null) ? {} : headerObj;
            var dataObject = (dataObj === undefined || dataObj === null) ? {} : dataObj;

            if(authToken === true) {
                // headerObject['Authorization'] = 'Token token='+sessionSvc.userData.access_token
            }

            if(idOnUrl === undefined || idOnUrl === null) {
                idOnUrl = '';
            } else {
                idOnUrl = '/'+idOnUrl;
            }

            var nextUrl = '';
            if(!(apiObj[apiObjKey].nextUrlPart === undefined || apiObj[apiObjKey].nextUrlPart === null)) {
                nextUrl = '/'+apiObj[apiObjKey].nextUrlPart;
            }

            if(!isEmpty(dataObj) && (!(dataObj.image_url === undefined || dataObj.image_url === null))) {
                dataObj.image_url = dataObj.image_url.$ngfDataUrl.substring(dataObj.image_url.$ngfDataUrl.indexOf(',')+1);
            }

            // If HTTP GET request, API params to be set to "params" key in $http request object
            // If HTTP POST/PUT request, API params to be set to "data" key in $http request object
            if(apiObj[apiObjKey].methodType.toLowerCase() == 'get') {
                $http({
                    method: apiObj[apiObjKey].methodType,
                    url: service.baseUrl + apiObj[apiObjKey].url + idOnUrl + nextUrl,
                    headers: headerObject,
                    params  : dataObject
                }).then(function(rs) {
                    if(rs.data.status === undefined || rs.data.status === null) {
                        deferred.reject(rs.data);
                    } else {
                        if (rs.data.status.toLowerCase() === 'ok') {
                            deferred.resolve(rs.data);
                        } else {
                            deferred.reject(rs.data);
                        }
                    }
                }, function(err) { // Non 200 response
                    
                });
            }
            else {
                $http({
                    method: apiObj[apiObjKey].methodType,
                    url: service.baseUrl + apiObj[apiObjKey].url + idOnUrl + nextUrl,
                    headers: headerObject,
                    data: dataObject
                }).then(function(rs) {
                    if(rs.data.status === undefined || rs.data.status === null) {
                        deferred.reject(rs.data);
                    } else {
                        if (rs.data.status.toLowerCase() === 'ok') {
                            deferred.resolve(rs.data);
                        } else {
                            deferred.reject(rs.data);
                        }
                    }
                }, function(err) { // Non 200 response
                    
                });
            }

            return deferred.promise;
        }

        function resetForm(formName, formObj) {
            formName.$setPristine();
            angular.copy({}, formObj);
        }

        function isEmpty(obj) {
            if (obj === void(0)) {
                return true;
            }

            for (var prop in obj) {
                if (obj[prop] === void(0)) {
                    delete obj[prop];
                }
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        }

        /* ======================================== Private Methods ======================================== */
        function init() {

        }

        init();
    }
})();
