/**
 * Created by villep on 29.8.2014.
 */
app.controller("AbilitiesController", function ($scope, $http, $filter) {
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
        var max = parseInt(ability.percent);

        if (ability.trainedPercent > 10)
            ability.trainedPercent = Math.round(( ability.trainedPercent / 5)) * 5;

        if (ability.trainedPercent < 0)
            ability.trainedPercent = 0;

        if (ability.trainedPercent > max)
            ability.trainedPercent = max;
    };

});

