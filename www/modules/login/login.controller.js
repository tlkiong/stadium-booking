(function() {
    'use strict';
    
    angular.module('Login')
        .controller('loginController', loginController);

    loginController.$inject = ['commonService', 'sessionService'];

    function loginController(commonService, sessionService) {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {};

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();