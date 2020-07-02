$(document).ready(function() {
  var excludedIds = ['USLACKBOT', 'U012640HMM1', "U012FEF25QR", "U012WLGC67N", "U011ZBEK5GE", "U013250CWJU","U01263L630A"];
  var intervalId;
  var members = [];
  var activeMember;
  var token = 'xoxp-1071075123139-1067388651558-1192691003616-ed340531ae8e2d3b4aca20503b79b44f';
  var slackUsersEndpoint = "https://slack.com/api/users.list?token=" + token;
  var $loading = $('#loading');
  var $randomizeBtn = $('#randomize');
  var $membersList = $('#members-list');
  var $hotseatImg = $('#hot-seat img');
  var $hotseatHeading = $('#hot-seat h2');
  var defaultImg = $hotseatImg.attr('src');
  var defaultHeading = $hotseatHeading.text();
  var $questionInput = $('#question');
  var $questionText = $('#question-text');
  var $correctBtn = $('#correct');
  var $incorrectBtn = $('#incorrect');

  function resetHotseat() {
    activeMember = null;
    $hotseatImg.attr('src', defaultImg);
    $hotseatHeading.text(defaultHeading);    
  }

  function removeMember(id) {
    var foundIndex = members.findIndex(function(member) {
      return id === member.id;
    });
    members.splice(foundIndex, 1);
    $('[data-id=' + id + ']').remove(); 
  }

  function handleCorrect() {
    removeMember(activeMember.id);
    resetHotseat();
  }

  function handleInputChange() {
    var val = $(this).val();
    $questionText.text(val);
  }

  function updateUI() {
    $hotseatImg.attr('src', activeMember.profile.image_512);
    $hotseatHeading.text(activeMember.profile.real_name);
    $membersList.find('img').removeClass('active');
    $('[data-id=' + activeMember.id + ']').addClass('active');
  }

  function randomize() {
    var count = 0;
    $correctBtn.removeClass('hidden');
    $incorrectBtn.removeClass('hidden');
    clearInterval(intervalId);
    intervalId = setInterval(function() {
      var random = (Math.floor(Math.random() * members.length));
      activeMember = members[random];
      updateUI()
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

    $loading.hide();
    renderMembers();
  }).catch(function(error) {
    console.log(error);
  });

  $randomizeBtn.on('click', randomize);
  $questionInput.on('change keyup', handleInputChange);
  $correctBtn.on('click', handleCorrect);
  $incorrectBtn.on('click', resetHotseat);
  $membersList.on('click', 'img', function() {
    removeMember($(this).attr('data-id'));
  });
});