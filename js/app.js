$(document).ready(function() {
  var $randomizeBtn = $('#randomize');
  var $membersList = $('#members-list');
  var $hotseatImg = $('#hot-seat img');
  var $hotseatHeading = $('#hot-seat h1');
  var slackUsersEndpoint = "https://slack.com/api/users.list?token=" + token;
  var intervalId;
  var members = [];
  var excludedIds = ['USLACKBOT', 'U012640HMM1', "U012FEF25QR"];

  function updateUI(member) {
    $hotseatImg.attr('src', member.profile.image_512);
    $hotseatHeading.text(member.profile.real_name);
    $membersList.find('img').removeClass('active');
    $('[data-id=' + member.id + ']').addClass('active');
  }

  function randomize() {
    var count = 0;
    clearInterval(intervalId);
    intervalId = setInterval(function() {
      var random = (Math.floor(Math.random() * members.length));
      updateUI(members[random])
      if (count === 10) {
        clearInterval(intervalId);
      }
      count++;
    }, 500);
  }

  function renderMembers() {
    for (var i = 0; i < members.length; i++) {
      var $thumb = $('<img src="' + members[i].profile.image_72 + '" data-id="' + members[i].id + '" alt="' + members[i].profile.display_name + '" />');
      $membersList.append($thumb);
    }
  }

  // init
  $.ajax({
    url: slackUsersEndpoint, 
    method: 'GET',
  }).then(function(response) {
    members = response.members.filter(function(member) {
      return !member.is_bot && !excludedIds.includes(member.id);
    });
    console.log(members)
    renderMembers();
  }).catch(function(error) {
    console.log(error);
  });

  $randomizeBtn.on('click', randomize)

});