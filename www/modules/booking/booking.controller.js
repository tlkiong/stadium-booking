(function() {
    'use strict';

    angular.module('Booking')
        .controller('bookingController', bookingController);

    bookingController.$inject = ['$scope', 'firebaseService', 'commonService', 'sessionService'];

    function bookingController($scope, firebaseService, commonService, sessionService) {
        var vm = this;
        vm.toggleView = toggleView;
        vm.changeMonth = changeMonth;
        vm.selectThisDate = selectThisDate;
        vm.selectTimeSlot = selectTimeSlot;
        vm.placeBooking = placeBooking;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            availableTimeSlotByHour: {},
            userData: {},
            stage: {
                selectDate: false,
                selectTime: false,
                payment: false
            },
            bookings: {
                /**
                 * year:
                 *     month:
                 *         day: 
                 *             time: userId
                 */
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
        function placeBooking() {
            fbaseSvc.stopListenToBookings();
            var tempConfirmedBookings = [];
            angular.copy(vm.misc.userData.myConfirmBookings, tempConfirmedBookings);
            fbaseSvc.placeBooking(vm.misc.userData.uid, tempConfirmedBookings);
            angular.copy([], vm.misc.userData.myConfirmBookings);
            angular.copy([], vm.misc.userData.myBookings);
            cmnSvc.goToPage('profile', true);
        }

        function selectTimeSlot(index, parentIndex) {
            vm.misc.userData.myBookings[parentIndex].availableTimeSlotByHour[index].isSelected = !vm.misc.userData.myBookings[parentIndex].availableTimeSlotByHour[index].isSelected;
        }

        function selectThisDate(index, parentIndex) {
            vm.misc.toProcessBookingDate = true;
            if (!vm.calendar.dateList[parentIndex][index].isFull && vm.calendar.dateList[parentIndex][index].val != '-') {
                vm.calendar.dateList[parentIndex][index].isSelected = !vm.calendar.dateList[parentIndex][index].isSelected;
            }
        }

        function changeMonth(toWhere) {
            var currentDateObj = new Date(vm.calendar.currentMonthYear);
            var month = currentDateObj.getMonth();
            var year = currentDateObj.getFullYear();
            if (toWhere === 'prev') {
                if (month == 0) {
                    getMonthDate(year - 1, 11);
                } else {
                    getMonthDate(year, month - 1);
                }
            } else if (toWhere === 'next') {
                if (month == 11) {
                    getMonthDate(year + 1, 0);
                } else {
                    getMonthDate(year, month + 1);
                }
            }
            processAvailableTimeSlot();
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

                if (vm.misc.toProcessBookingDate) {
                    processMyBookingDate();
                }
            } else if (viewName === 'payment') {
                vm.misc.stage.selectDate = false;
                vm.misc.stage.selectTime = false;
                vm.misc.stage.payment = true;
                processMyBookingTimeSlot();
            }
        }

        /* ======================================== Private Methods ======================================== */
        function processMyBookingTimeSlot() {
            angular.copy([], sessionSvc.userData.myConfirmBookings);
            sessionSvc.userData.myBookings.forEach(function(element) {
                element.availableTimeSlotByHour.forEach(function(element2) {
                    if (element2.isSelected) {
                        var tempBookingobj = {};
                        tempBookingobj['dayTime'] = element2.timeInEpoch;
                        sessionSvc.userData.myConfirmBookings.push(tempBookingobj);
                    }
                });
            });

        }

        function processAvailableTimeSlot() {
            var currentMonth = (new Date(vm.calendar.currentMonthYear)).getMonth().toString();
            var currentYear = (new Date(vm.calendar.currentMonthYear)).getFullYear().toString();
            var counter = 0;

            vm.calendar.dateList.forEach(function(element1) {
                element1.forEach(function(element2) {
                    if (element2 != '-') {
                        if (!(vm.misc.bookings[currentYear][currentMonth][element2.val] === undefined || vm.misc.bookings[currentYear][currentMonth][element2.val] === null)) {
                            for (var key in vm.misc.bookings[currentYear][currentMonth][element2.val]) {
                                if (vm.misc.bookings[currentYear][currentMonth][element2.val].hasOwnProperty(key) 
                                    && (vm.misc.bookings[currentYear][currentMonth][element2.val] != '') 
                                    && ((new Date(Date.now())).getDate() > element2.val)) {
                                    counter += 1;
                                }
                            }
                            element2.slotBooked = counter;
                            if (element2.slotBooked == element2.totalSlotAvail) {
                                element2.isFull = true;
                            }
                        }
                    }
                });
            });

            $scope.$apply();
        }

        function processBookingDateTime(day, listOfTimeObj) {
            var tempDateObj = new Date(Number(day));
            if (vm.misc.bookings[tempDateObj.getFullYear()] === undefined || vm.misc.bookings[tempDateObj.getFullYear()] === null) {
                vm.misc.bookings[tempDateObj.getFullYear().toString()] = {}
            }
            if (vm.misc.bookings[tempDateObj.getFullYear().toString()][tempDateObj.getMonth()] === undefined || vm.misc.bookings[tempDateObj.getFullYear()][tempDateObj.getMonth()] === null) {
                vm.misc.bookings[tempDateObj.getFullYear().toString()][tempDateObj.getMonth().toString()] = {}
            }
            if (vm.misc.bookings[tempDateObj.getFullYear().toString()][tempDateObj.getMonth().toString()][tempDateObj.getDate()] === undefined || vm.misc.bookings[tempDateObj.getFullYear()][tempDateObj.getMonth()][tempDateObj.getDate()] === null) {
                vm.misc.bookings[tempDateObj.getFullYear().toString()][tempDateObj.getMonth().toString()][tempDateObj.getDate().toString()] = {};
            }
            for (var key in listOfTimeObj) {
                if (listOfTimeObj.hasOwnProperty(key)) {
                    if (!(listOfTimeObj[key].userId === undefined || listOfTimeObj[key].userId === null) && (listOfTimeObj[key].userId != '')) {
                        vm.misc.bookings[tempDateObj.getFullYear().toString()][tempDateObj.getMonth().toString()][tempDateObj.getDate().toString()][key] = listOfTimeObj[key].userId;
                    }
                }
            }

            processAvailableTimeSlot();
        }

        function processMyBookingDate() {
            if (vm.misc.userData.myBookings === undefined || vm.misc.userData.myBookings === null) {
                sessionSvc.userData.myBookings = [];
            }
            vm.calendar.dateList.forEach(function(element) {
                element.forEach(function(element2) {
                    if (element2.isSelected) {
                        // element2.val = date (1-29/30/31)
                        var tempMyBookingObj = {
                            dayTimeInEpoch: (new Date(vm.calendar.currentMonthYear.getFullYear(), vm.calendar.currentMonthYear.getMonth(), element2.val)).getTime(),
                            status: 'going',
                            availableTimeSlotByHour: []
                        }
                        for (var i = 8; i < 23; i++) {
                            var tempTimeInDateObj = (new Date(vm.calendar.currentMonthYear.getFullYear(), vm.calendar.currentMonthYear.getMonth(), element2.val, i));
                            var timeAvailForBooking = true;
                            if (!(vm.misc.bookings[tempTimeInDateObj.getFullYear()] === undefined || vm.misc.bookings[tempTimeInDateObj.getFullYear()] === null) && !(vm.misc.bookings[tempTimeInDateObj.getFullYear()][tempTimeInDateObj.getMonth()] === undefined || vm.misc.bookings[tempTimeInDateObj.getFullYear()][tempTimeInDateObj.getMonth()] === null) && !(vm.misc.bookings[tempTimeInDateObj.getFullYear()][tempTimeInDateObj.getMonth()][tempTimeInDateObj.getDate()] === undefined || vm.misc.bookings[tempTimeInDateObj.getFullYear()][tempTimeInDateObj.getMonth()][tempTimeInDateObj.getDate()] === null)) {
                                if (!(vm.misc.bookings[tempTimeInDateObj.getFullYear()][tempTimeInDateObj.getMonth()][tempTimeInDateObj.getDate()][tempTimeInDateObj.getTime()] === undefined || vm.misc.bookings[tempTimeInDateObj.getFullYear()][tempTimeInDateObj.getMonth()][tempTimeInDateObj.getDate()][tempTimeInDateObj.getTime()] === null)) {
                                    timeAvailForBooking = false;
                                }
                            }


                            tempMyBookingObj.availableTimeSlotByHour.push({
                                timeInEpoch: tempTimeInDateObj.getTime(),
                                isSelected: false,
                                isAvailForBooking: timeAvailForBooking
                            });

                        }
                        sessionSvc.userData.myBookings.push(tempMyBookingObj);
                    }
                });
            });
        }

        function processDate(givenDate) {
            // 1 row has 7 columns - index from 0 - 6
            var totalColumns = givenDate.lastDay.getDate() + givenDate.firstDay.getDay();
            var dateCounter = 1;
            var tempArr = [];
            var tempObj = {};
            vm.calendar.dateList = [];
            for (var i = 0, j = totalColumns; i < j; i++) {
                var canBook = true;

                if((new Date(Date.now())).getDate() <= dateCounter) {
                    canBook = true;
                }

                if (i >= givenDate.firstDay.getDay()) {
                    tempObj = {
                        canBook: canBook,
                        val: dateCounter,
                        isSelected: false,
                        isFull: false,
                        slotBooked: 0,
                        totalSlotAvail: 13
                    };
                    tempArr.push(tempObj);
                    dateCounter++;
                } else {
                    tempObj = {
                        canBook: canBook,
                        val: '-',
                        isSelected: false,
                        isFull: false,
                        slotBooked: 0,
                        totalSlotAvail: 13
                    };
                    tempArr.push(tempObj);
                }

                if (tempArr.length > 0 && tempArr.length % 7 == 0 || i == j - 1) {
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

            // for (var i = 8; i < 23; i++) {
            //     vm.misc.availableTimeSlotByHour[i] = {
            //         timeInEpoch: 0,
            //         isSelected: false,
            //         isAvailForBooking: true
            //     }
            // }

            fbaseSvc.listenToBookings().then(function(rs) {
                // When anyone add a new time slot, this will be called
                rs.on("child_changed", function(snapshot) {
                    /**
                     * snapshot.key() refers to the day in epoch
                     * snapshot.val() refers to the object of all the time of the day
                     */
                    processBookingDateTime(snapshot.key(), snapshot.val());
                });

                // Child Added is on first read or when anyone add a new day slot
                rs.on("child_added", function(snapshot) {
                    /**
                     * snapshot.key() refers to the day in epoch
                     * snapshot.val() refers to the object of all the time of the day
                     */
                    processBookingDateTime(snapshot.key(), snapshot.val());
                });

                // Check if there is any removed
                rs.on("child_removed", function(snapshot) {
                    /**
                     * snapshot.key() refers to the day in epoch
                     * snapshot.val() refers to the object of all the time of the day
                     */
                    // processBookingDateTime(snapshot.key(), snapshot.val());
                });
            });
        }

        init();
    }
})();
