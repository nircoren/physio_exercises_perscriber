"use client";
import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import ResultsGrid from "./ResultsGrid";
import { Exercises } from "@/types/Exercises";

export interface SearchResult {
  // id: string;
  // name: string;
  exercises: Exercises[];
  injury?: string; // Add injury field
  // Add more fields as needed
}

const emptySearchResult: SearchResult = {
  exercises: [],
  injury: "",
};

const SearchInjury: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [results, setResults] = useState<SearchResult>(emptySearchResult);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    console.log('waasdasd')
    if (inputValue) {
      setLoading(true);
      axios
        .get<SearchResult>(
          // `http://localhost:8082/api/getExercises?injury=${inputValue}`
          `http://65.109.160.94:8082/api/getExercises?injury=${inputValue}`
        )
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.error("There was an error making the request!", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResults(emptySearchResult);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const formatExercisesForSharing = () => {
    return results.exercises
      .map(
        (exercise) =>
          `${exercise.exerciseName.he}:\n${exercise.exerciseDescription}\nWatch here: https://www.youtube.com/watch?v=${exercise.youtubeVideoId}\n`
      )
      .join("\n");
  };

  const handleShareOnWhatsApp = () => {
    const message = `Injury: ${
      results.injury
    }\n\ תרגילים:http://65.109.160.94/ \n\n${formatExercisesForSharing()}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="text-right mt-10" dir="rtl">
      <h2 className="text-center">חפשו את הפציעה</h2>
      <div className="flex justify-center my-5">
        <input
          className="border border-black rounded p-1 text-right "
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="חיפוש"
        />
        <button
          className="border border-black rounded px-4 ml-2 hover:bg-gray-100"
          onClick={handleSearch}
        >
          חיפוש
        </button>
      </div>
      {results.exercises.length > 0 && (
        <div className="flex justify-center my-8">
          <button
            className="flex items-center justify-center border rounded px-4 py-2 bg-green-500 text-white hover:bg-green-600"
            onClick={handleShareOnWhatsApp}
          >
          <img src="whatsapp.png" className="w-7 ml-2" alt="" />

            שיתוף בוואטסאפ
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center">
          <img src="loading.gif" alt="" />
        </div>
      ) : (
        ""
      )}
      <ResultsGrid exercises={results.exercises} />
    </div>
  );
};

export default SearchInjury;
