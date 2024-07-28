"use client";
import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import ResultsGrid from "./ResultsGrid";
import { Exercises } from "@/types/Exercises";
import { useTranslation } from "react-i18next";
import initTranslations from "@/i18n";

export interface SearchResult {
  exercises: Exercises[];
  injury?: string;
}

const emptySearchResult: SearchResult = {
  exercises: [],
  injury: "",
};

const SearchInjury = ({ locale }: any) => {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState<string>("");
  const [results, setResults] = useState<SearchResult>(emptySearchResult);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (inputValue) {
      setLoading(true);
      axios
        .get<SearchResult>(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS}api/getExercises?injury=${inputValue}&lang=${locale}`
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

  const handleRemoveExercise = (index: number) => {
    setResults((prevResults) => {
      const updatedExercises = [...prevResults.exercises];
      updatedExercises.splice(index, 1);
      return { ...prevResults, exercises: updatedExercises };
    });
  };

  const handleDescriptionChange = (index: number, newDescription: string) => {
    setResults((prevResults) => {
      const updatedExercises = [...prevResults.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        exerciseDescription: newDescription,
      };
      return { ...prevResults, exercises: updatedExercises };
    });
  };

  const handleRemoveVideo = (index: number) => {
    setResults((prevResults) => {
      const updatedExercises = [...prevResults.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        youtubeVideoId: "",
      };
      return { ...prevResults, exercises: updatedExercises };
    });
  };

  const handleNameChange = (index: number, newName: string) => {
    setResults((prevResults) => {
      const updatedExercises = [...prevResults.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        exerciseName: {
          ...updatedExercises[index].exerciseName,
          he: newName,
        },
      };
      return { ...prevResults, exercises: updatedExercises };
    });
  };

  const formatExercisesForSharing = () => {
    return results.exercises
      .map(
        (exercise,idx) =>
          `${idx + 1}. ${exercise.exerciseName[locale as "en" | "he"]}:\n${exercise.exerciseDescription} ${exercise.youtubeVideoId ? `\n ${t('hero:to_video')}: https://www.youtube.com/watch?v=${exercise.youtubeVideoId}\n`: '\n'}`
      )
      .join("\n");
  };

  const handleShareOnWhatsApp = () => {
    const message = `Injury: ${
      results.injury
    }\n\ ${t("hero:exercises")} : \n\n${formatExercisesForSharing()}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="mt-10">
      <h1 className="text-center text-xl">{t("hero:search_injury")}</h1>
      <div className="flex justify-center my-5">
        <input
          className="border border-black rounded p-1"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={t("hero:search")}
        />
        <button
          className="border border-black rounded px-4 hover:bg-gray-100"
          onClick={handleSearch}
        >
          {t('hero:search')}
        </button>
      </div>
      {results.exercises.length > 0 && (
        <div className="text-center">
          <p>{t("hero:search_desc")}</p>
          <div className="flex justify-center my-8">
            <button
              className="flex items-center justify-center border rounded px-4 py-2 bg-green-500 text-white hover:bg-green-600"
              onClick={handleShareOnWhatsApp}
            >
              <img src="whatsapp.png" className="w-7 mr-2" alt="" />
              {t("hero:share_on_whatsapp")}
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center">
          <img src="loading.gif" alt="" />
        </div>
      ) : (
        ""
      )}
      <ResultsGrid
        locale={locale}
        exercises={results.exercises}
        onRemoveExercise={handleRemoveExercise}
        onDescriptionChange={handleDescriptionChange}
        onRemoveVideo={handleRemoveVideo}
        onNameChange={handleNameChange}
      />
    </div>
  );
};

export default SearchInjury;
