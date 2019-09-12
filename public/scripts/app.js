$(() => {
  const $createPollBtn = $('.create-poll');
  const $newPollForm = $('.new-poll-form');
  const $voteForm = $('.submission-form');
  const $newVote = $('.new-vote-submit');
  const $email = $('.poll-email');
  const $question = $('.poll-question');
  const $ch1 = $('.poll-ch1');
  const $ch1Desc = $('.poll-ch1-desc');
  const $ch2 = $('.poll-ch2');
  const $ch2Desc = $('.poll-ch2-desc');
  const $ch3 = $('.poll-ch3');
  const $ch3Desc = $('.poll-ch3-desc');

  // New poll form slides down on click 'create poll'
  $createPollBtn.on('click', () => {
    $newPollForm.slideToggle();
    $email.focus();
  });

  // New poll form slides up and clears on submit
  $newPollForm.on('submit', evt => {
    // Hijack the new poll form for AJAX
    evt.preventDefault();
    const formData = $newPollForm.serialize();
    $.ajax({
      type: 'POST',
      url: '/pollite/',
      data: formData
    })
      .then($newPollForm.slideUp())
      .then($email.val(''))
      .then($question.val(''))
      .then($ch1.val(''))
      .then($ch1Desc.val(''))
      .then($ch2.val(''))
      .then($ch2Desc.val(''))
      .then($ch3.val(''))
      .then($ch3Desc.val(''))
      .catch(err => {
        alert('Failed to submit poll data');
      });
  });

  // New vote
  $voteForm.on('submit', evt => {
    evt.preventDefault();
    const formData = $voteForm.serialize();
    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: formData
    })
    .done(function(data){console.log(data)})
    .fail(err => {
      alert('Failed to submit a new vote');
    });
  });
});
