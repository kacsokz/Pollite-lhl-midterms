const db = require('../lib/db');

// insert new poll into db
const createPoll = poll => {
  const queryString = `
    INSERT INTO polls (email, question)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [poll.email, poll.question];
  return db.query(queryString, values)
  .then(res => res.rows[0]);
};
exports.createPoll = createPoll;

// insert new choice into db
const createChoice = choice => {
  const queryString = `
    INSERT INTO choices (poll_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [choice.poll_id, choice.title, choice.description];
  return db.query(queryString, values)
  .then(res => res.rows[0]);
};
exports.createChoice = createChoice;

// insert new vote into db
const createVote = vote => {
  const queryString = `
    INSERT INTO votes (poll_id, choice_id, ranking)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [vote.poll_id, vote.choice_id, vote.ranking];
  return db.query(queryString, values)
  .then(res => res.rows);
};
exports.createVote = createVote;

// delete poll by poll id
const deletePoll = pollId => {
  const queryString = `
    DELETE FROM polls
    WHERE polls.id = $1;
  `;
  const values = [pollId];
  return db.query(queryString, values)
  .then(res => res.rows[0]);
};
exports.deletePoll = deletePoll;

// get question by poll id
const getDetailsByPollIds = pollId => {
  const queryString = `
    SELECT id, question, date
    FROM polls
    WHERE id = $1
  `;
  const values = [pollId];
  return db.query(queryString, values)
  .then(res => res.rows[0]);
};
exports.getDetailsByPollIds = getDetailsByPollIds;

// get choices by poll id
const getChoicesByPollId = pollId => {
  const queryString = `
    SELECT id, title, description
    FROM choices
    WHERE poll_id = $1;
  `;
  const values = [pollId];
  return db.query(queryString, values)
  .then(res => res.rows);
};
exports.getChoicesByPollId = getChoicesByPollId;

// get poll result by poll id
const getResultsByPollId = pollId => {
  const queryString = `
    SELECT question, choices.title AS choice, choices.description AS description, sum(ranking) AS ranking
    FROM polls
    JOIN choices ON polls.id = choices.poll_id
    JOIN votes ON choices.id = votes.choice_id
    WHERE polls.id = $1
    GROUP BY polls.id, choices.id
    ORDER BY ranking;
  `;
  const values = [pollId];
  return db.query(queryString, values)
  .then(res => res.rows);
}
exports.getResultsByPollId = getResultsByPollId;
