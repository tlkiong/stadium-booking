(function() {
    'use strict';
    
    angular.module('Profile')
        .controller('profileController', profileController);

    profileController.$inject = ['firebaseService', 'commonService', 'sessionService'];

    function profileController(firebaseService, commonService, sessionService) {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();