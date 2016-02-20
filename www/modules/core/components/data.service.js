(function() {
    'use strict';
    angular.module('Core')
        .service('dataService', dataService);

    dataService.$inject = ['lokijsService', '$q'];

    function dataService(lokijsService, $q) {
        var lokiSvc = lokijsService;


        var Service = function(collectionName, index) {
            this.collection = lokiSvc.loadCollection(collectionName, index);
            this.database = lokiSvc.getDatabase();
            this.service = lokiSvc;
        };

        Service.prototype = {
            saveObj: saveObj,
            deleteObj: deleteObj,
            deleteObjs: deleteObjs,
            getAllObjs: getAllObjs,
            findObj: findObj,
            saveDatabase: saveDatabase,
            getSerializeDb: getSerializeDb,
            loadSerializeDb: loadSerializeDb,
            findDateRange: findDateRange
        };

        return Service;


        function getSerializeDb() {
            var deferred = $q.defer();

            this.service.getSerializedDb().then(function(rs) {
                deferred.resolve(rs);
            }, function(err) {
                deferred.reject(err);
            })

            return deferred.promise;
        }

        function loadSerializeDb(serializedDb, options) {
            var deferred = $q.defer();

            this.service.loadDbFromJSON(serializedDb, options).then(function(rs) {
                deferred.resolve(rs);
            }, function(err) {
                deferred.reject(err);
            })

            return deferred.promise;
        }

        // Callback is optional here
        /**
         * [This saves the database]
         * @return {[promise]} [Resolved if ok. Reject if error]
         */
        function saveDatabase() {
            var deferred = $q.defer();
            this.database.then(function(rs) {
                rs.saveDatabase(function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
            }, function(failedErr) {
                deferred.reject(failedErr);
            });

            return deferred.promise;
        }

        /**
         * [This will save unique or non unique objects based on
         * the 2nd param passed in - unique key.]
         * @param  {[object]} object       [Object that will be saved]
         * @param  {[String]} uniqueColumn [The key that will be checked for uniqueness]
         * @return {[promise]}              [A resolved / rejected promise. Rejected will be: 'Duplicated Key']
         */
        function saveObj(object, uniqueColumn) {
            var deferred = $q.defer();

            var objectForSaving = {};
            angular.copy(object, objectForSaving);

            if (objectForSaving.hasOwnProperty('$loki')) {
                objectForSaving.dateModified = Date.now();
                this.collection.then(function(rs) {
                    rs.update(objectForSaving);
                    var objUpdated = rs.findOne({ $loki: objectForSaving.$loki });
                    deferred.resolve(objUpdated);
                }, function(err) {
                    deferred.reject('Error updating obj: ', err);
                });
            } else {
                var objSaved = {};
                objectForSaving.dateCreated = Date.now();
                this.collection.then(function(rs) {
                    try {
                        if (uniqueColumn === null || uniqueColumn === undefined) {
                            objSaved = rs.insert(objectForSaving);
                            deferred.resolve(objSaved);
                        } else {
                            var object = {};
                            object[uniqueColumn] = objectForSaving[uniqueColumn];

                            var haveObjInDb = rs.findOne(object);

                            if (haveObjInDb === null) {
                                objSaved = rs.insert(objectForSaving);
                                deferred.resolve(objSaved);
                            } else {
                                deferred.reject('Duplicated key');
                            }
                        }
                    } catch (err) {
                        deferred.reject('Error saving obj: ' + err);
                    }
                }, function(err) {
                    deferred.reject("Error saving obj: " + err);
                });
            }

            return deferred.promise;
        }

        function deleteObj(object) {
            var deferred = $q.defer();

            this.collection.then(function(rs) {
                rs.remove(object);
                deferred.resolve();
            });

            return deferred.promise;
        }

        function deleteObjs(listOfObjs) {
            var deferred = $q.defer();

            this.collection.then(function(rs) {
                rs.removeWhere(function(obj) {
                    for (var i in listOfObjs) {
                        if (obj.$loki == listOfObjs[i]) {
                            return true;
                        }
                    }
                    return false;
                });
                deferred.resolve();
            });

            return deferred.promise;
        }

        function getAllObjs() {
            var deferred = $q.defer();

            this.collection.then(function(rs) {
                deferred.resolve(rs.find({}));
            });

            return deferred.promise;
        }

        function findObj(query) {
            var deferred = $q.defer();

            this.collection.then(function(rs) {
                var result = rs.find(query);

                if (result === undefined || result === null || result.length === 0) {
                    deferred.reject('No result found');
                } else {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        }

        function findDateRange(dateStart, dateEnd) {
            var deferred = $q.defer();

            this.collection.then(function(rs) {
                var result = rs.find({ '$and': [{ 'meta.created': { $gt: dateStart } }, { 'meta.created': { $lt: dateEnd } }] });
                console.log(result);
                if (result === undefined || result === null || result.length === 0) {
                    deferred.reject('No result found');
                } else {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        }
    }
})();
