(function() {

    'use strict';

    angular.module('Core')
        .service('firebaseService', firebaseService);

    firebaseService.$inject = ['sessionService', 'commonService'];

    function firebaseService(sessionService, commonService) {
        var service = this;
        service.getFirebaseRef = getFirebaseRef;
        service.simpleLogin = simpleLogin;
        service.createSimpleLoginUser = createSimpleLoginUser;
        service.isLoggedInToFirebase = isLoggedInToFirebase;

        /* ======================================== Var ==================================================== */
        var firebaseUrl = 'https://stadium-booking.firebaseio.com/';

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */
        function isLoggedInToFirebase() {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef().then(function(rs) {
                var authData = rs.getAuth()
                if (authData) {
                    deferred.resolve(authData); // Is logged in
                } else {
                    deferred.reject(); // Is not logged in
                }
            })

            return deferred.promise;
        }

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
                        }, function(err) {

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
                        getUserProfile(authData).then(function(rs){
                            sessionSvc.userData.fullName = rs.fullName;
                            sessionSvc.userData.role = rs.role;
                            sessionSvc.userData.emailAdd = rs.emailAdd;
                            deferred.resolve(rs);
                        }, function (err){
                            deferred.reject(err);
                        })
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
        function getUserProfile(authData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef('users/' + authData.uid).then(function(rs) {
                rs.once('value', function(snap) {
                    deferred.resolve(snap.val());
                });
            })

            return deferred.promise;
        }

        function createUserProfile(userData) {
            var deferred = cmnSvc.$q.defer();

            getFirebaseRef('users/' + userData.uid).then(function(rs) {
                rs.set({
                    emailAdd: userData.emailAdd,
                    role: userData.role,
                    fullName: userData.fullName
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
