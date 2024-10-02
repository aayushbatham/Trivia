import React, { useState, useEffect } from "react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search query
  const [filteredQuizzes, setFilteredQuizzes] = useState([]); // State to hold filtered quiz results
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetch quizzes from the backend based on the search query
  const fetchQuizzes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://172.20.10.2:3000/quiz/quizzes/search?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setFilteredQuizzes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      fetchQuizzes(searchQuery); // Fetch quizzes based on user input
    } else {
      setFilteredQuizzes([]); // Reset if search query is empty
    }
  };

  // Reset filtered quizzes if search query is empty
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredQuizzes([]);
    }
  }, [searchQuery]);

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl mb-4">Search Quizzes</h2>

      <form
        onSubmit={handleSearch}
        className="mb-4 flex items-center flex-row justify-between align-middle"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search Quiz"
          className="w-full p-2 rounded-l-lg bg-[#333] text-white"
        />
        <button
          type="submit"
          className="mt-0 bg-[#e6d438] text-black px-4 py-2 rounded-r-lg"
        >
          Search
        </button>
      </form>

      {/* Loading state */}
      {loading && <p className="text-white">Loading...</p>}

      {/* Error state */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display search results */}
      {filteredQuizzes.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Search Results:</h3>
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-[#1f1f1f] p-4 rounded-lg shadow-md w-full"
              >
                <h4 className="text-xl font-bold text-white">{quiz.title}</h4>
                <p className="text-sm text-gray-300">{quiz.description}</p>
                <p className="text-sm text-green-300">
                  Rating: {quiz.difficulty}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-[#d1c343] text-black px-4 py-2 rounded-lg"
                    onClick={() => console.log(`Starting quiz: ${quiz.id}`)}
                  >
                    Start Quiz
                  </button>
                  <button
                    className="bg-[#555] text-white px-4 py-2 rounded-lg"
                    onClick={() =>
                      console.log(`Viewing leaderboard for quiz: ${quiz.id}`)
                    }
                  >
                    View Quiz Leaderboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading &&
        searchQuery && (
          <p className="text-sm text-gray-500">
            No quizzes found for "{searchQuery}"
          </p>
        )
      )}
    </div>
  );
};

export default Search;
