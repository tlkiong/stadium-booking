(function() {

    'use strict';

    angular.module('Core')
        .service('sessionService', sessionService);

    sessionService.$inject = ['$state'];

    function sessionService($state) {
        var service = this;

        /* ======================================== Var ==================================================== */
        service.userData = {
            fullName: '',
            role: '',
            emailAdd: ''
        };

        /* ======================================== Services =============================================== */

        /* ======================================== Public Methods ========================================= */


        /* ======================================== Private Methods ======================================== */
        function getStates() {
            var list = $state.get();

            for (var x in list) {
                if (!(list[x].role === undefined || list[x].role === null || list[x].role === '')) {
                    service.allStates[list[x].name] = list[x].role;
                }
            }
        }

        function init() {
            getStates();
        }

        init();
    }

})();
