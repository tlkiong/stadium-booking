(function() {
    'use strict';
    
    angular.module('Login')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'firebaseService', 'commonService', 'sessionService'];

    function loginController($scope, firebaseService, commonService, sessionService) {
        var vm = this;
        vm.simpleLogin = simpleLogin;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            authData: {}
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;
        var scope = $scope;

        /* ======================================== Public Methods ========================================= */
        function simpleLogin() {
            console.log('scope: ',scope.loginForm);
            if((vm.misc.authData.emailAdd === undefined || vm.misc.authData.emailAdd === null || vm.misc.authData.emailAdd == '')
                && (vm.misc.authData.password === undefined || vm.misc.authData.password === null || vm.misc.authData.password == '')){
                alert('Please input both your email address & password');
            } else {
                if(vm.misc.savePassword) {
                    localStorage.setItem('emailAdd', vm.misc.authData.emailAdd);
                    localStorage.setItem('password', vm.misc.authData.password);
                } else {
                    localStorage.removeItem('emailAdd');
                    localStorage.removeItem('password');
                }

                var userData = {};
                angular.copy(vm.misc.authData, userData)
                fbaseSvc.simpleLogin(userData).then(function(rs){
                    console.log(rs);
                    // Go to page
                }, function (err){

                });
            }
        }

        /* ======================================== Private Methods ======================================== */
        function init() {
            vm.misc.authData.emailAdd = localStorage.getItem('emailAdd');
            vm.misc.authData.password = localStorage.getItem('password');
            if(!(vm.misc.authData.emailAdd === undefined || vm.misc.authData.emailAdd === null)
                && !(vm.misc.authData.password === undefined || vm.misc.authData.password === null)) {
                vm.misc.savePassword = true;
            }
        }

        init();
    }
})();