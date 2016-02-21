(function() {
    'use strict';

    angular.module('Booking')
        .controller('bookingController', bookingController);

    bookingController.$inject = ['firebaseService', 'commonService', 'sessionService'];

    function bookingController(firebaseService, commonService, sessionService) {
        var vm = this;
        vm.toggleView = toggleView;
        vm.changeMonth = changeMonth;
        vm.selectThisDate = selectThisDate;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            userData: {},
            stage: {
                selectDate: false,
                selectTime: false,
                payment: false
            }
        };

        vm.calendar = {
            currentMonthYear: 0,
            header: ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'],
            dateList: []
        }

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        function selectThisDate (index,parentIndex){
            if(!vm.calendar.dateList[parentIndex][index].isFull && vm.calendar.dateList[parentIndex][index].val != '-') {
                vm.calendar.dateList[parentIndex][index].isSelected = !vm.calendar.dateList[parentIndex][index].isSelected;
            }
        }

        function changeMonth(toWhere) {
            var currentDateObj = new Date(vm.calendar.currentMonthYear);
            var month = currentDateObj.getMonth();
            var year = currentDateObj.getFullYear();
            if(toWhere === 'prev') {
                if(month == 0) {
                    getMonthDate(year-1,11);
                } else {
                    getMonthDate(year,month-1);
                }
            } else if (toWhere === 'next') {
                if(month == 11) {
                    getMonthDate(year+1,0);
                } else {
                    getMonthDate(year,month+1);
                }
            }
        }

        function toggleView(viewName) {
            if (viewName === 'selectDate') {
                vm.misc.stage.selectDate = true;
                vm.misc.stage.selectTime = false;
                vm.misc.stage.payment = false;
            } else if (viewName === 'selectTime') {
                vm.misc.stage.selectDate = false;
                vm.misc.stage.selectTime = true;
                vm.misc.stage.payment = false;
            } else if (viewName === 'payment') {
                vm.misc.stage.selectDate = false;
                vm.misc.stage.selectTime = false;
                vm.misc.stage.payment = true;
            }
        }

        /* ======================================== Private Methods ======================================== */
        function processDate(givenDate) {
            // 1 row has 7 columns - index from 0 - 6
            var totalColumns = givenDate.lastDay.getDate() + givenDate.firstDay.getDay();
            var dateCounter = 1;
            var tempArr = [];
            vm.calendar.dateList = [];
            for (var i = 0, j = totalColumns; i < j; i++) {
                if (i >= givenDate.firstDay.getDay()) {
                    tempArr.push({
                        val: dateCounter,
                        isSelected: false,
                        isFull: false,
                        availSlot: 0
                    });
                    dateCounter++;
                } else {
                    tempArr.push({
                        val: '-',
                        isSelected: false,
                        isFull: false,
                        availSlot: 0
                    });
                }

                if (tempArr.length > 0 && tempArr.length % 7 == 0 || i==j-1) {
                    vm.calendar.dateList.push(tempArr);
                    tempArr = [];
                }
            }
        }

        function getMonthDate(year, month) {
            var givenDate = {};
            // If month is not defined, assume this fn return for current month
            if (month === undefined || month === null) {
                var date = new Date();
                vm.calendar.currentMonthYear = date;
                givenDate.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                givenDate.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            } else {
                var date = new Date(year, month);
                vm.calendar.currentMonthYear = date;
                givenDate.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                givenDate.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            }
            processDate(givenDate);
        }

        function init() {
            vm.misc.userData = sessionSvc.userData;
            toggleView('selectDate');
            getMonthDate();
        }

        init();
    }
})();
