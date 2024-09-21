// utils/elo.js

/**
 * Calculate the new Elo rating for a user after a match.
 * @param {number} currentElo - The current Elo rating of the user.
 * @param {number} opponentElo - The Elo rating of the opponent.
 * @param {number} actualScore - The actual score of the user (1 for win, 0 for loss, 0.5 for draw).
 * @param {number} [kFactor=32] - The K-factor, which controls the sensitivity of the rating changes.
 * @returns {number} - The new Elo rating of the user.
 */
const calculateElo = (currentElo, opponentElo, actualScore, kFactor = 32) => {
  const expectedScore =
    1 / (1 + Math.pow(10, (opponentElo - currentElo) / 400));
  return currentElo + kFactor * (actualScore - expectedScore);
};

/**
 * Update Elo ratings for two users after a quiz.
 * @param {Object} user1 - The first user object.
 * @param {Object} user2 - The second user object.
 * @param {number} user1Score - The score of the first user.
 * @param {number} user2Score - The score of the second user.
 * @returns {Object} - The new Elo ratings for both users.
 */
const updateEloAfterQuiz = (user1, user2, user1Score, user2Score) => {
  // Determine actual scores based on quiz results
  const user1ActualScore =
    user1Score > user2Score ? 1 : user1Score < user2Score ? 0 : 0.5;
  const user2ActualScore =
    user2Score > user1Score ? 1 : user2Score < user1Score ? 0 : 0.5;

  // Calculate new Elo ratings
  const newEloUser1 = calculateElo(
    user1.eloRating,
    user2.eloRating,
    user1ActualScore
  );
  const newEloUser2 = calculateElo(
    user2.eloRating,
    user1.eloRating,
    user2ActualScore
  );

  return {
    user1NewElo: newEloUser1,
    user2NewElo: newEloUser2,
  };
};

module.exports = {
  calculateElo,
  updateEloAfterQuiz,
};
