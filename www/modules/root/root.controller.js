(function() {
    'use strict';
    
    angular.module('Root')
        .controller('rootController', rootController);

    rootController.$inject = ['commonService', 'sessionService'];

    function rootController(commonService, sessionService) {
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