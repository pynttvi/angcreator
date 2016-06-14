/**
 * Created by villep on 26.8.2014.
 */
var app = angular.module('Angcreator', ['ui.bootstrap']);

app.controller("MainController", function ($scope, $http, $filter) {

    $scope.$watch('$viewContentLoaded', function () {

        getAbilityCostFile("skills");
        getAbilityCostFile("spells");
    });

    $scope.skillCost = [];
    $scope.spellCost = [];

    $scope.totalSkillCost = 0;

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
            fixMaxes();


        //COUNTERS
        countAbilityExp();


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


    function countAbilityExp() {

        var costList = [0, 1, 2, 4, 8, 13, 22, 38, 64, 109, 184, 310, 523, 882, 1487, 2506,
            4222, 7115, 11989, 20202, 34040, 999999, 999999, 999999];

        var skillCostListSize = $scope.skillCost.length;
        angular.forEach($scope.reinc.guilds, function (guild, i) {
            angular.forEach(guild.abilities, function (ability, j) {
                if (ability.type == 'skill') {
                    var skillcost;
                    for (var i = 0; i < skillCostListSize; i++) {
                        if (ability.name == $scope.skillCost[i])
                            skillcost = $scope.skillCost[i];
                    }
                    if (skillcost != null) {
                        var costListIndex = parseInt(ability.trainedPercent) / 5;
                        var cost = costList[costListIndex];
                        alert(cost * ($scope.reinc.race.skicost / 100));
                    }
                }
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


    function getAbilityCostFile(type) {
        if ($scope.skillCost.length < 1) {
            $http({method: 'GET', url: 'https://rawgit.com/juuussi/zCreator_data/master/data/' + type + '.chr'}).
                success(function (data, status, headers, config) {
                    var guildFile = atob(data.content);
                    var lines = guildFile.split('\n');

                    angular.forEach(lines, function (line, i) {
                        var cols = line.split(":");
                        var name = cols[0];
                        var cost = cols[1];
                        if (name != null && cost != null) {
                            if (type == 'skills') {
                                $scope.skillCost.push({
                                    name: name,
                                    cost: cost
                                });
                            }

                            if (type == 'spells') {
                                $scope.spellCost.push({
                                    name: name,
                                    cost: cost
                                });
                            }
                        }

                    });

                }).
                error(function (data, status, headers, config) {
                    alert("error:" + status);
                    alert("error:" + data);
                });
        }
    }


})
;
