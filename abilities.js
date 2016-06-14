/**
 * Created by villep on 29.8.2014.
 */
app.controller("AbilitiesController", function ($scope, $http, $filter) {


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
        $http({method: 'GET', url: 'https://rawgit.com/juuussi/zCreator_data/master/data/' + fileName}).
            success(function (data, status, headers, config) {

                var guildFile = data.content;
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
            max: percent,
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


    $scope.getAllAbilitiesByType = function (type) {
        var allGuilds = []
        var allSkills = []

        angular.forEach($scope.reinc.guilds, function (guild, it) {
            allGuilds.push(guild);
            angular.forEach(guild.subguilds, function (subguild, sit) {
                if (subguild.chosenLevels > 0)
                    allGuilds.push(subguild);
            });
        });

        angular.forEach(allGuilds, function (guild, i) {
            var skills = $filter('filter')(guild.abilities, {type: type});
            angular.forEach(skills, function (skill, j) {
                var foundSkills = $filter('filter')(allSkills, {name: skill.name});
                if (foundSkills.length > 0) {
                    if (foundSkills[0].percent < skill.percent) {
                        angular.forEach(allSkills, function (existing, k) {
                            if (existing.name == skill.name) {
                                allSkills[k] = skill;
                            }
                        });
                    }
                } else {
                    allSkills.push(skill);
                }
            });
        });
        return allSkills;
    }

    $scope.validateAbility = function (ability) {
        var max = parseInt(ability.max);

        if (ability.trainedPercent > 10)
            ability.trainedPercent = Math.round(( ability.trainedPercent / 5)) * 5;

        if (ability.trainedPercent < 0)
            ability.trainedPercent = 0;

        if (ability.trainedPercent > max)
            ability.trainedPercent = max;
    };

});
