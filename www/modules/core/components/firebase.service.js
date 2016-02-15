(function() {

    'use strict';

    angular.module('Core')
        .service('firebaseService', firebaseService);

    firebaseService.$inject = [];

    function firebaseService('commonService') {
        var service = this;
        service.getFirebaseRef = getFirebaseRef;

        /* ======================================== Var ==================================================== */
        var firebaseUrl = 'https://stadium-booking.firebaseio.com/';

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;

        /* ======================================== Public Methods ========================================= */
        function createSimpleLoginUser(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef().then(function(rs) {
                rs.createUser({
                    email: userData.emailAdd,
                    password: userData.password
                }, function(error, userVal) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        userData.uid = userVal.uid;
                        createUserProfile(userData).then(function(rs) {
                            simpleLogin(userData);
                        }, function (err){

                        });
                        
                    }
                });
            })

            return deferred.promise;
        }

        function simpleLogin(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef().then(function(rs) {
                rs.authWithPassword({
                    email: userData.emailAdd,
                    password: userData.password
                }, function(error, authData) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        getUserProfile(authData);
                    }
                }, {
                    remember: "sessionOnly"
                });
            });

            return deferred.promise;
        }

        function getFirebaseRef(path) {
            var deferred = cmnSvc.$q.defer();

            if (path == undefined || path == null || path.length <= 0) {
                deferred.resolve(new Firebase(firebaseUrl));
            } else {
                deferred.resolve(new Firebase(firebaseUrl + path));
            }

            return deferred.promise;
        }
        /* ======================================== Private Methods ======================================== */
        function createUserProfile(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef('users/' + userData.uid).then(function(rs) {
                rs.set({
                    emailAdd: userData.emailAdd
                }, function(error) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve('user created successfully');
                    }
                });
            })

            return deferred.promise;
        }

        function init() {

        }

        init();
    }
})();
