import { Exercises } from "@/types/Exercises";
import { SearchResult } from "./SearchInjury";

const ResultsGrid: React.FC<SearchResult> = ({ exercises }) => {
  return (
    <section className="flex flex-wrap">
      {exercises.map((exercise : any, idx : number) => (
        <div key={idx} className="w-full md:w-1/2 lg:w-1/3 p-4">
          <h6 className="font-semibold text-lg">{exercise.exerciseName.he}</h6>
          <p className="min-h-33 mb-2">{exercise.exerciseDescription}</p>
          {exercise.youtubeVideoId && (
            <iframe
              width="100%"
              height="250"
              src={`https://www.youtube.com/embed/${exercise.youtubeVideoId}`}
              className="w-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      ))}
    </section>
  );
};

export default ResultsGrid;
