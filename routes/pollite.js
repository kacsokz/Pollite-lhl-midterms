const express = require('express');
const polliteRoutes  = express.Router();
const { createPoll,
  createChoice,
  createVote,
  deletePoll,
  getDetailsByPollIds,
  getChoicesByPollId,
  getResultsByPollId
} = require('../db/queries/poll-queries');
const { pollCreatedEmail, pollCompletedEmail } = require('./mailgun');


// Admin/Results Page
polliteRoutes.get('/:poll_id/admin', (req, res) => {
  const pollId = req.params.poll_id;
  getResultsByPollId(pollId).then(pollResults => {
    res.render('admin', { pollId, pollResults });
  })
    .catch(err => {
      return res
        .status(500)
        .json({ error: err.message });
    });
});


// Delete current poll from db
// Redirect to landing page
polliteRoutes.post('/:poll_id/delete', (req, res) => {
  const pollId = req.params.poll_id;
  deletePoll(pollId).then(() => {
    return res.redirect('/pollite');
  })
    .catch(err => {
      return res
        .status(500)
        .json({ error: err.message });
    });
});


// Vote Submission Page
// Render voting page with poll details and sortable choices
polliteRoutes.get('/:poll_id', (req, res) => {
  const pollId = req.params.poll_id;
  getDetailsByPollIds(pollId).then(results => {
    const pollData = results;
    getChoicesByPollId(pollId).then((pollChoices) => {
      res.render('submission', { pollData, pollChoices });
    });
  })
    .catch(err => {
      return res
        .status(500)
        .json({ error: err.message });
    });
});


// Vote Submission Page
// Submitted votes are inserted into db
polliteRoutes.post('/:poll_id', (req, res) => {
  const pollId = req.params.poll_id;
  // Mailgun
  pollCompletedEmail(pollId);
  const normalizedVotes = Object.keys(req.body).map((choiceString, index) => {
    const choiceId = parseInt(choiceString.split('-')[1]);
    return {
      poll_id: pollId,
      choice_id: choiceId,
      ranking: (3 - index)
    };
  });
  let votesPromise = [];
  normalizedVotes.map(vote => {
    votesPromise.push(createVote(vote));
  });
  Promise.all(votesPromise).then(() => {
    console.log('Promise.all Complete!');
    return res.redirect('/pollite/');
  });
});


// Landing Page / Create New Poll Page
// Render landing page
polliteRoutes.get('/', (req, res) => {
  console.log(req.body);
  res.render('index');
});


// Admin/Results JSON
polliteRoutes.get('/:poll_id/json', (req, res) => {
  const pollId = req.params.poll_id;
  getResultsByPollId(pollId).then(pollResults => {
    res.json(pollResults);
  })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Admin/Results Page
polliteRoutes.get('/:poll_id/admin', (req, res) => {
  const pollId = req.params.poll_id;
  getResultsByPollId(pollId).then(pollResults => {
    res.render('admin', { pollResults, pollId });
  })
    .catch(err => {
      return res
        .status(500)
        .json({ error: err.message });
    });
});


// Landing Page / Create New Poll Page
// New polls are inserted into db
polliteRoutes.post('/', (req, res) => {
  const { email, question } = req.body;
  createPoll({ email, question }).then((newPoll) => {
    // Mailgun
    pollCreatedEmail(newPoll.id);
    const ch1 = {
      poll_id: newPoll.id,
      title: req.body.ch1,
      description: req.body.ch1desc
    };
    const ch2 = {
      poll_id: newPoll.id,
      title: req.body.ch2,
      description: req.body.ch2desc
    };
    const ch3 = {
      poll_id: newPoll.id,
      title: req.body.ch3,
      description: req.body.ch3desc
    };
    const choices = [ch1, ch2, ch3];
    let choicesPromise = [];
    choices.forEach((choice) => {
      choicesPromise.push(createChoice(choice));
    });
    return Promise.all(choicesPromise);
  }).catch(err => {
    return res
      .status(500)
      .json({ error: err.message });
  });
  res.redirect('/');
});

module.exports = polliteRoutes;
