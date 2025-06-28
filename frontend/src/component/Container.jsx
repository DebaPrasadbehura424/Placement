import React, { useEffect, useState } from "react";
import axios from "axios";

function Container() {
  const [topics, setTopics] = useState([]);
  const [solvedStatus, setSolvedStatus] = useState({});
  const [openTopics, setOpenTopics] = useState({}); // Track open/closed state for each topic
  const [allOpen, setAllOpen] = useState(false); // Track if all topics are open
  const userId = sessionStorage.getItem("userId");

  // State for tracking solved counts with predefined totals
  const [solvedCounts, setSolvedCounts] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Predefined total counts
  const TOTAL_QUESTIONS = 176;
  const EASY_TOTAL = 31;
  const MEDIUM_TOTAL = 108;
  const HARD_TOTAL = 37;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get("http://localhost:5500/auth/me", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        const fetchedTopics = res.data.topics || [];
        setTopics(fetchedTopics);

        // Initialize openTopics with all topics closed
        const initialOpenTopics = {};
        fetchedTopics.forEach((topic) => {
          initialOpenTopics[topic.sub] = false;
        });
        setOpenTopics(initialOpenTopics);

        // Create status map and calculate solved counts
        const statusMap = {};
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;

        fetchedTopics.forEach((topic) => {
          topic.ques.forEach((q) => {
            const key = `${topic?.sub}-${q.id}`;
            statusMap[key] = q.solved;
            if (q.solved) {
              if (q.difficulty === "easy") easyCount++;
              else if (q.difficulty === "medium") mediumCount++;
              else if (q.difficulty === "hard") hardCount++;
            }
          });
        });

        setSolvedStatus(statusMap);
        setSolvedCounts({
          total: easyCount + mediumCount + hardCount,
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
        });
      } catch (err) {
        console.error("Fetch error", err);
      }
    }

    fetchUserData();
  }, []);

  const toggleSolved = async (topic, questionId) => {
    const key = `${topic}-${questionId}`;
    const updated = {
      ...solvedStatus,
      [key]: !solvedStatus[key],
    };
    setSolvedStatus(updated);

    // Find the question's difficulty to update counts
    let questionDifficulty = null;
    topics.forEach((t) => {
      if (t.sub === topic) {
        const question = t.ques.find((q) => q.id === questionId);
        if (question) questionDifficulty = question.difficulty;
      }
    });

    // Update solved counts
    setSolvedCounts((prev) => {
      const isSolving = !solvedStatus[key]; // True if marking as solved, false if unmarking
      const newCounts = { ...prev };
      if (questionDifficulty) {
        if (isSolving) {
          newCounts[questionDifficulty]++;
          newCounts.total++;
        } else {
          newCounts[questionDifficulty]--;
          newCounts.total--;
        }
      }
      return newCounts;
    });

    try {
      await axios.patch("http://localhost:5500/questions/toggle-question", {
        userId,
        topic,
        questionId,
      });
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  // Toggle individual topic open/closed
  const toggleTopic = (topicSub) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicSub]: !prev[topicSub],
    }));
  };

  // Toggle all topics open/closed
  const toggleAllTopics = () => {
    const newOpenState = !allOpen;
    const updatedOpenTopics = {};
    topics.forEach((topic) => {
      updatedOpenTopics[topic.sub] = newOpenState;
    });
    setOpenTopics(updatedOpenTopics);
    setAllOpen(newOpenState);
  };

  const difficultyColor = (difficulty) => {
    return difficulty === "easy"
      ? "text-green-600"
      : difficulty === "medium"
      ? "text-yellow-600"
      : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center text-blue-800 mb-8 sm:mb-10">
        PrepTrail DSA Sheet
      </h1>

      {/* Stats Box */}
      <div className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700">
          Progress
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium text-gray-600">
              Total
            </p>
            <p className="text-lg sm:text-xl font-bold text-blue-800">
              {solvedCounts.total}/{TOTAL_QUESTIONS}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium text-green-600">
              Easy
            </p>
            <p className="text-lg sm:text-xl font-bold text-green-600">
              {solvedCounts.easy}/{EASY_TOTAL}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium text-yellow-600">
              Medium
            </p>
            <p className="text-lg sm:text-xl font-bold text-yellow-600">
              {solvedCounts.medium}/{MEDIUM_TOTAL}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium text-red-600">
              Hard
            </p>
            <p className="text-lg sm:text-xl font-bold text-red-600">
              {solvedCounts.hard}/{HARD_TOTAL}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle All Button */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
        <button
          onClick={toggleAllTopics}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {allOpen ? "Close All" : "Open All"}
        </button>
      </div>

      {/* Topics and Questions */}
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">
                {topic.sub}
              </h2>
              <button
                onClick={() => toggleTopic(topic.sub)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {openTopics[topic.sub] ? "Close" : "Open"}
              </button>
            </div>
            {openTopics[topic.sub] && (
              <ol className="list-decimal pl-5 sm:pl-6 space-y-3 mt-4">
                {topic.ques.map(({ id, text, difficulty }) => {
                  const key = `${topic.sub}-${id}`;
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between gap-2 sm:gap-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={!!solvedStatus[key]}
                          onChange={() => toggleSolved(topic.sub, id)}
                          className="w-5 h-5 accent-blue-600 rounded focus:ring-2 focus:ring-blue-300 transition"
                        />
                        <span
                          className={`flex-1 text-sm sm:text-base transition-all duration-200 ${
                            solvedStatus[key]
                              ? "text-gray-400 line-through"
                              : "text-gray-800 hover:text-blue-600"
                          }`}
                        >
                          {text}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${difficultyColor(
                          difficulty
                        )} min-w-[60px] text-right`}
                      >
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Container;
