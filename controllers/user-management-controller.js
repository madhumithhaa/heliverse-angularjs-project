function getCurrentPageUsers(pageNumber, users) {
  const start = (pageNumber - 1) * USERS_PER_PAGE;
  const end = start + USERS_PER_PAGE;
  return users.slice(start, end);
};

function onPageClick(pageNumber) {
  const scope = this;
  scope.currentPage = pageNumber;
  scope.usersToShow = getCurrentPageUsers(pageNumber, scope.users);
};

function getPageNumbers(startPage, totalPages) {
  let arr = [];
  for (var i = startPage; i < startPage + 3 && i <= totalPages; i++) {
      arr.push(i);
  }
  return arr;
}

function getDomains() {
  var domains = new Set();

  USERS.forEach(function(user) {
      domains.add(user.domain);
  });

  return Array.from(domains); 
}

function getGenders() {
  var genders = new Set();

  USERS.forEach(function(user) {
      genders.add(user.gender); 
  });

  return Array.from(genders); 
}

userManagementApp.controller("userManagementController", function($scope) {
  $scope.showUsersListView = true;
    $scope.users = USERS.map(user => user);

    $scope.domains = getDomains()
    $scope.genders = getGenders()


    $scope.totalPages = Math.ceil($scope.users.length/20);

    $scope.selectedValues = {}
    $scope.selectedDomains = [];
    $scope.selectedGenders = [];
    $scope.selectedAvailabilities = [];
    $scope.username = '';

    $scope.currentPage = 1;

    $scope.pageNumbers = getPageNumbers(1, $scope.totalPages)
    $scope.usersToShow = getCurrentPageUsers($scope.currentPage, $scope.users);
    $scope.onPageClick = onPageClick.bind($scope)

    $scope.onNext = function() {
      const pageNumbers = getPageNumbers($scope.pageNumbers[0] + 3, $scope.totalPages); 
      const currentPage = pageNumbers[0];
      $scope.currentPage = currentPage;
      $scope.pageNumbers = pageNumbers;
      $scope.usersToShow = getCurrentPageUsers($scope.currentPage, $scope.users)

    }

    $scope.onPrevious = function() {
      const pageNumbers = getPageNumbers($scope.pageNumbers[0] - 3, $scope.totalPages); 
      const currentPage = pageNumbers[0];
      $scope.currentPage = currentPage;
      $scope.pageNumbers = pageNumbers;
      $scope.usersToShow = getCurrentPageUsers($scope.currentPage, $scope.users)
    }

    $scope.onValueChange = function() {
      $scope.currentPage = 1;

      $scope.users = USERS.filter(function(user) {
          let userNameCheck = true;
          let availablityCheck = true;
          let domainCheck = true;
          let genderCheck = true;
          if($scope.username) {
            const username = user.first_name + (user.last_name? ' ' + user.last_name: '');
            userNameCheck = username.toLowerCase().includes($scope.username.toLowerCase());
          }
          if($scope.selectedAvailabilities.length) {
            availablityCheck = $scope.selectedAvailabilities.includes(user.available? 'Available': 'Not Available');
          }
          if($scope.selectedDomains.length) {
            domainCheck = $scope.selectedDomains.includes(user.domain);
          }
          if($scope.selectedGenders.length) {
            genderCheck = $scope.selectedGenders.includes(user.gender);
          }
          return userNameCheck && availablityCheck && genderCheck && domainCheck;
      });
      $scope.totalPages = Math.ceil($scope.users.length/20);
      $scope.pageNumbers = getPageNumbers(1, $scope.totalPages)
      $scope.usersToShow = getCurrentPageUsers($scope.currentPage, $scope.users);
    }

    $scope.goToCreateTeamView = function() {
      $scope.showCreateTeamErrorView = false
      $scope.selectedValues = {};
      $scope.showUsersListView = false;
      $scope.showCreateTeamView = true;
      $scope.showCreatedTeamView = false;
    }

    $scope.createTeam = function() {
      const values = Object.values($scope.selectedValues).filter((value) => value);
      if(!values.length) {
        $scope.showCreateTeamErrorView = true
        return;
      }
      $scope.showUsersListView = false;
      $scope.showCreateTeamView = false;
      $scope.showCreatedTeamView = true;
    }

    $scope.goToUsersList = function() {
      $scope.showUsersListView = true;
      $scope.showCreateTeamView = false;
      $scope.showCreatedTeamView = false;
    }
  });