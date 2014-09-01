/**
 * Created by villep on 26.8.2014.
 */
var app = angular.module('Angcreator', ['ui.bootstrap']);

app.controller("MainController", function ($scope, $http, $filter) {


    $scope.reinc = {
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

    $scope.validateStat = function (stat) {
        var myStat = parseInt(stat);
        if (myStat > 50)
            stat = 50;

        if (myStat < 0)
            stat = 0;
    }


    $scope.getAbilities = function () {
        setTimeout(function () {
            angular.forEach($scope.reinc.guilds, function (guild, i) {
                if (!guild.abilities)
                    getAbilities(guild);
            });
        });
    };

    function getAbilities(guild) {
        var fileName = guild.name.toLowerCase() + ".chr"
        $http({method: 'GET', url: '//api.github.com/repos/pynttvi/char-creator-data/contents/' + fileName}).
            success(function (data, status, headers, config) {

                var guildFile = atob(data.content);
                var lines = guildFile.split('\n');
                var abilities = getAbilitiesFromLines(lines, guild);
                var myAbilities = getAbilitiesForChosenLevel(abilities, guild.chosenLevels);
                guild.abilities = myAbilities;
            }

        ).
            error(function (data, status, headers, config) {
                alert("error:" + status);
                alert("error:" + data);
            });
    }

    function getAbilitiesForChosenLevel(abilities, chosenLevel) {
        var uniqueAbilities = [];
        angular.forEach(abilities, function (abi, it) {
            if (abi.level <= chosenLevel) {
                var foundAbility = $filter('filter')(uniqueAbilities, {name: abi.name});
                if (foundAbility.length == 0)
                    uniqueAbilities.push(abi);
                else {
                    if (foundAbility[0].level < abi.level) {
                        var uniqueAbilityIdx
                        angular.forEach(uniqueAbilities, function (uniqabi, it) {
                            if (uniqabi.name == abi.name)
                                uniqueAbilities[it] = abi;
                        });
                    }
                }
            }
        });

        var testString = "";
        angular.forEach(uniqueAbilities, function (abi, it) {
            testString += abi.name + abi.percent + "\n"
        });

        return uniqueAbilities;
    }

    function getAbilitiesFromLines(lines, guild) {
        var abilities = [];
        var currentLevel = 0;
        for (var k = 0; k < lines.length; k++) {

            if (lines[k].contains("Level")) {
                currentLevel += 1
            }
            if (lines[k].contains("May study spell")) {
                var spell = getAbilityFromLine(lines[k], "spell", currentLevel, guild);
                abilities.push(spell);
            }
            if (lines[k].contains("May train skill")) {
                var skill = getAbilityFromLine(lines[k], "skill", currentLevel, guild);
                abilities.push(skill);
            }
        }
        return abilities;
    }

    function getAbilityFromLine(line, type, level, guild) {

        var splitLine = line.split(" ");
        var toIndex = getToIndex(splitLine);
        var abilityName = "";
        for (var j = 3; j < toIndex; j++) {
            abilityName += splitLine[j] + " ";
        }
        var percent = splitLine[toIndex + 1].replace("%", "");
        var ability = {
            name: abilityName.trim(),
            type: type,
            percent: percent,
            level: level,
            guild: guild.name
        };

        return ability;
    }

    function getToIndex(tokenizedLine) {
        var toIndex
        for (var j = 0; j < tokenizedLine.length; j++) {
            if (tokenizedLine[j] == "to")
                toIndex = j;
        }
        return toIndex;
    }

})
;