(function() {

    'use strict';

    angular.module('Core')
        .service('firebaseService', firebaseService);

    firebaseService.$inject = [];

    function firebaseService() {
        var service = this;

        /* ======================================== Var ==================================================== */
        var firebaseUrl = 'https://stadium-booking.firebaseio.com/';
        service.firebaseRef = new Firebase(firebaseUrl);

        /* ======================================== Services =============================================== */

        /* ======================================== Public Methods ========================================= */
        function createUserProfile(userData) {

        }

        function createSimpleLoginUser(userData) {
            service.firebaseRef.createUser({
                email: userData.emailAdd,
                password: userData.password
            }, function(error, userVal) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userVal.uid);
                    userData.uid = userVal.uid;
                    createUserProfile(userData);
                    simpleLogin(userData);
                }
            });
        }

        function simpleLogin(userData) {
            service.firebaseRef.authWithPassword({
                email: userData.emailAdd,
                password: userData.password
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    getUserProfile(authData);
                }
            }, {
                remember: "sessionOnly"
            });
        }

        /* ======================================== Private Methods ======================================== */
        function init() {

        }

        init();
    }
})();
