(function() {
    'use strict';
    
    angular.module('Login')
        .controller('loginController', loginController);

    loginController.$inject = ['dataService', '$scope', 'firebaseService', 'commonService', 'sessionService'];

    function loginController(dataService, $scope, firebaseService, commonService, sessionService) {
        var vm = this;
        vm.simpleLogin = simpleLogin;
        vm.switchBetweenForgotPasswordNLogin = switchBetweenForgotPasswordNLogin;
        vm.retrieveForgotPassword = retrieveForgotPassword;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            state: 'login',
            authData: {}
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;
        var scope = $scope;
        var dataSvc = dataService;

        /* ======================================== Public Methods ========================================= */
        function retrieveForgotPassword() {
            var userData = {};
            angular.copy(vm.misc.forgotPassword, userData);
            cmnSvc.resetForm(scope.forgotPasswordForm, vm.misc.authData);
            fbaseSvc.resetForgetPassword(userData.emailAdd).then(function(rs){
                alert(rs);
            }, function(err){
                alert('Error! '+err);
            });
        }

        function switchBetweenForgotPasswordNLogin() {
            if(vm.misc.state == 'forgotPassword') {
                vm.misc.state = 'login';
            } else if (vm.misc.state == 'login') {
                vm.misc.state = 'forgotPassword';
            }
        }

        function simpleLogin() {
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
                angular.copy(vm.misc.authData, userData);
                fbaseSvc.simpleLogin(userData).then(function(rs){
                    cmnSvc.resetForm(scope.loginForm, vm.misc.authData);
                    cmnSvc.goToPage('profile', true)
                }, function (err){
                    alert('Error! '+err);
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