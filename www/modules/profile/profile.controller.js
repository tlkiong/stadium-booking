(function() {
    'use strict';
    
    angular.module('Profile')
        .controller('profileController', profileController);

    profileController.$inject = ['firebaseService', 'commonService', 'sessionService'];

    function profileController(firebaseService, commonService, sessionService) {
        var vm = this;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            userData: {}
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        

        /* ======================================== Private Methods ======================================== */
        function init() {
            vm.misc.userData = sessionSvc.userData;
            fbaseSvc.getMyBookings(vm.misc.userData.uid).then(function(rs){
                vm.misc.userData.myBookings = rs;
            }, function(err){

            });
        }

        init();
    }
})();