import React from "react";
import { Exercises } from "@/types/Exercises";
import { useTranslation } from "react-i18next";

interface ResultsGridProps {
  locale: string;
  exercises: Exercises[];
  onRemoveExercise: (index: number) => void;
  onDescriptionChange: (index: number, newDescription: string) => void;
  onRemoveVideo: (index: number) => void;
  onNameChange: (index: number, newName: string) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  locale,
  exercises,
  onRemoveExercise,
  onDescriptionChange,
  onRemoveVideo,
  onNameChange,
}) => {
  const { t } = useTranslation();

  const handleDescriptionEdit = (
    event: React.FocusEvent<HTMLDivElement>,
    index: number
  ) => {
    const newDescription = event.target.innerText;
    onDescriptionChange(index, newDescription);
  };

  const handleNameEdit = (
    event: React.FocusEvent<HTMLDivElement>,
    index: number
  ) => {
    const newName = event.target.innerText;
    onNameChange(index, newName);
  };

  return (
    <section className="flex text-black flex-wrap">
      {exercises.map((exercise, idx) => (
        <div key={idx} className="w-full md:w-1/2 lg:w-1/3 p-4 relative my-10">
          <button
            className="absolute top-0 right-0 p-1 text-sm bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            onClick={() => onRemoveExercise(idx)}
          >
            X
          </button>
          <p className="font-semibold text-lg mb-2">
            {idx + 1}.&nbsp;
            <div
              className="inline"
              contentEditable
              onBlur={(event) => handleNameEdit(event, idx)}
              suppressContentEditableWarning={true}
            >
              {exercise.exerciseName[locale as "en" | "he"]}
            </div>
          </p>

          <div
            className="h-24 mb-2"
            contentEditable
            onBlur={(event) => handleDescriptionEdit(event, idx)}
            suppressContentEditableWarning={true}
          >
            {exercise.exerciseDescription}
          </div>
          {exercise.youtubeVideoId ? (
            <div className="relative mt-5">
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${exercise.youtubeVideoId}`}
                className="w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                className="absolute -bottom-10 right-0 p-1 px-2 bg-red-500 text-white rounded-full"
                onClick={() => onRemoveVideo(idx)}
              >
          {t('hero:remove_video')}
              </button>
            </div>
          ) : (
            <p className="">{t('hero:video_not_attached')}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default ResultsGrid;
