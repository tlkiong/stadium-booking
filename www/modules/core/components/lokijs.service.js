(function() {
    'use strict';
    angular.module('Core')
        .controller('lokijsService', lokijsService);

    lokijsService.$inject = ['commonService'];

    function lokijsService(commonService) {
        var service = this;
        service.loadCollection = loadCollection;
        service.deleteDB = deleteDB;
        service.getDatabase = getDatabase;
        service.getSerializedDb = getSerializedDb;
        service.loadDbFromJSON = loadDbFromJSON;

        /* ======================================== Var ==================================================== */
        var db;
        var idbAdapter;
        var dbName = 'stadium_app';

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;

        /* ======================================== Public Methods ========================================= */
        function loadDbFromJSON(serializedDb, options) {
            var deferred = $q.defer();

            db.then(function(rs) {
                rs.loadJSON(serializedDb, options);
                deferred.resolve("success");
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getSerializedDb() {
            // rs.serialize() will return a JSON format of the entire database
            // which can be used to load into another app
            var deferred = cmnSvc.$q.defer();

            db.then(function(rs) {
                deferred.resolve(rs.serialize());
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getDatabase() {
            return db;
        }

        /*
			  deleteDB() - deletes all exisiting data
			  USE WITH CAUTION !!!
			*/
        function deleteDB() { idbAdapter.deleteDatabase(dbName); }

        function loadCollection(collectionName, options) {
            var collection = db.then(function(rs) {
                var temp = rs.getCollection(collectionName);

                if (!temp) {
                    var optionsObj = {};
                    angular.copy(options, optionsObj);

                    temp = rs.addCollection(collectionName, optionsObj);
                }
                return temp;
            });

            return collection;
        }

        /* ======================================== Private Methods ======================================== */
        function loadDb() {
            var deferred = cmnSvc.$q.defer();

            idbAdapter = new lokiIndexedAdapter(dbName); //only for browser

            var lokidb = new loki(dbName, {
                autosave: true,
                autosaveInterval: 5000, // 5 seconds autosave
                adapter: idbAdapter
            });

            lokidb.loadDatabase({}, function() {
                console.log('Database loaded');
                deferred.resolve(lokidb);
            });

            return deferred.promise;
        }

        function init() {
            db = loadDb();
        }

        init();
    }
})();
