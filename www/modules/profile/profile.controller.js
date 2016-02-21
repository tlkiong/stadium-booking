(function() {
    'use strict';

    angular.module('Profile')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope', 'firebaseService', 'commonService', 'sessionService'];

    function profileController($scope, firebaseService, commonService, sessionService) {
        var vm = this;
        vm.cancelBooking = cancelBooking;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            userData: {},
            myBookingListFromFbaseIsNotEmpty: false
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        function cancelBooking(key) {
            fbaseSvc.cancelMyBooking(vm.misc.userData.uid, key).then(function(rs) {
                angular.copy([],sessionSvc.userData.myBookingListFromFbase);
                getMyBookingList();
            }, function(err) {
                alert(err);
                console.log('Error in cancel booking: ', err);
            });
        }

        /* ======================================== Private Methods ======================================== */
        // Update Booking status to went for those that is not 'cancel' for before this hour
        function updateBookingStatus() {

        }

        function getMyBookingList() {
            fbaseSvc.getMyBookings(vm.misc.userData.uid).then(function(rs) {
                for (var key in rs) {
                    if (rs.hasOwnProperty(key)) {
                        sessionSvc.userData.myBookingListFromFbase.push({
                            key: key,
                            createdAt: rs[key].createdAt,
                            status: rs[key].status,
                            updatedAt: rs[key].updatedAt,
                            dayTime: rs[key].dayTime
                        });
                    }
                }
                updateBookingStatus();
                vm.misc.myBookingListFromFbaseIsNotEmpty = !cmnSvc.isEmpty(vm.misc.userData.myBookingListFromFbase);
            }, function(err) {

            });
        }

        function init() {
            vm.misc.userData = sessionSvc.userData;
            getMyBookingList();
        }

        init();
    }
})();
