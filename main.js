/**
 * Created by villep on 26.8.2014.
 */
var app = angular.module('Angcreator', ['ui.bootstrap']);

app.controller("MainController", function ($scope, $http, $filter) {


    $scope.reinc = {
        race: null,
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
        if ($scope.reinc.race != null)
            fixMaxes()


        //COUNTERS


    }, true);


    function fixMaxes() {

        var skillFactor = parseInt($scope.reinc.race.skimax);
        var spellFactor = parseInt($scope.reinc.race.spemax);

        if ($scope.reinc.wishes.greater.knowledge == true) {
            skillFactor += 10
            spellFactor += 10
        }
        if ($scope.reinc.wishes.lesser.knowledge == true) {
            skillFactor += 5
            spellFactor += 5
        }

        angular.forEach($scope.reinc.guilds, function (guild, i) {
            angular.forEach(guild.abilities, function (ability, j) {
                if (ability.type == 'skill')
                    ability.max = Math.round((ability.percent / 5 * skillFactor) / 100) * 5
                if (ability.type == 'spell')
                    ability.max = Math.round((ability.percent / 5 * spellFactor) / 100) * 5

            });
        });
    }

    $scope.validateStat = function (stat) {
        var myStat = parseInt(stat);
        if (myStat > 50)
            stat = 50;

        if (myStat < 0)
            stat = 0;
    }


})
;