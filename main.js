/**
 * Created by villep on 26.8.2014.
 */
var app = angular.module('Angcreator', ['ui.bootstrap']);

app.controller("MainController", function ($scope, $http, $filter) {


    $scope.reinc = {
        qp: 0,
        freeLevels: 0,
        guilds: [],
        stats: {
            str: 0,
            con: 0,
            dex: 0,
            int: 0,
            wis: 0,
            cha: 0
        },
        wishes: {
            greater: {
                knowledge: false,
                physical: false,
                magical: false,
                critical: false,
                haste: false,
                stats: false

            },
            lesser: {
                knowledge: false,
                physical: false,
                magical: false,
                critical: false,
                haste: false,
                stats: false,
                thickSkin: false
            },
            minor: {
                str: false,
                con: false,
                dex: false,
                int: false,
                wis: false,
                cha: false,
                trueSeeing: false,
                lucky: false
            }
        }
    };
    $scope.$watch('reinc', function () {

        //FIXERS



        //COUNTERS



    }, true);

    $scope.validateStat = function (stat) {
        var myStat = parseInt(stat);
        if (myStat > 50)
            stat = 50;

        if (myStat < 0)
            stat = 0;
    }


})
;