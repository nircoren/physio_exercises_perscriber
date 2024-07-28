package main

import (
	// "encoding/json"
	"encoding/json"
	"fmt"
	"golang_yt_scraper/openai"
	"golang_yt_scraper/utils"
	"golang_yt_scraper/youtube"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/getExercises", corsMiddleware(getExercisesHandler))
	fmt.Println("Server starting on http://localhost:8082")
	log.Fatal(http.ListenAndServe(":8082", nil))
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	fmt.Println(utils.GetEnvVar("WEBSITE_URL"))

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", utils.GetEnvVar("WEBSITE_URL"))
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			return
		}
		next(w, r)
	}
}

func getExercisesHandler(w http.ResponseWriter, r *http.Request) {
	injuryName := r.URL.Query().Get("injury")
	lang := r.URL.Query().Get("lang")
	if injuryName == "" {
		http.Error(w, "Missing injury query parameter", http.StatusBadRequest)
		return
	}

	// Get the exercises from OpenAI
	system := `Your role is to receive input which is a name of an injury, and give names of the most relevant exercieses for patient to do.
    max exercises number is 5.
    return the exerciseDescription in lang ` + lang + ` 
    return exerciseName in both lang
    please return this as a json:
    {
    	exercises : [
			exerciseName : {
			"en":string,
			"he":string
			}
			exerciseDescription : string // (how to do)
		]
		injury : string
    }
    `
	user := injuryName

	result, err := openai.GenerateExercises(system, user)

	if err != nil {
		log.Printf("Error generating exercises: %v", err)
		http.Error(w, "Error generating exercises", http.StatusInternalServerError)
		return
	}

	// Search for each exercise on YouTube
	for key, exercise := range result.Exercises {
		videoID, err := youtube.GetFirstVideoID(exercise.ExerciseName.En)
		if err != nil {
			log.Printf("Error getting video ID for %s: %v", exercise.ExerciseName.En, err)
			continue
		}
		exercise.YoutubeVideoId = videoID
		result.Exercises[key] = exercise
		// youtubeVideoIds = append(youtubeVideoIds, videoID)
	}

	// Appending elements to the slice

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func test(w http.ResponseWriter, r *http.Request) {
	jsontest := `
	{
"exercises": [
{
"exerciseName": {
"en": "Quadriceps Stretch",
"he": "מתיחת שרירי הירך הקדמיים"
},
"exerciseDescription": "עמדו על רגל אחת, כופפו את הברך השנייה ואחזו בקרסול. משכו את הקרסול לכיוון הישבן עד שתרגישו מתיחה בשרירי הירך הקדמיים. החזיקו למשך 30 שניות וחזרו על הפעולה עם הרגל השנייה.",
"youtubeVideoId": "l83s6t8VWsE"
},
{
"exerciseName": {
"en": "Hamstring Stretch",
"he": "מתיחת שרירי הירך האחוריים"
},
"exerciseDescription": "שבו על הרצפה עם רגל אחת ישרה והשנייה מכופפת כך שכף הרגל נוגעת בירך הפנימית של הרגל הישרה. התכופפו קדימה לכיוון הרגל הישרה והחזיקו למשך 30 שניות. חזרו על הפעולה עם הרגל השנייה.",
"youtubeVideoId": "cxyyEE4lCa0"
},
{
"exerciseName": {
"en": "Calf Stretch",
"he": "מתיחת שרירי השוק"
},
"exerciseDescription": "עמדו מול קיר, הניחו את הידיים על הקיר בגובה הכתפיים. כופפו רגל אחת קדימה והשנייה ישרה מאחור. דחפו את העקב של הרגל האחורית כלפי הרצפה עד שתרגישו מתיחה בשרירי השוק. החזיקו למשך 30 שניות וחזרו על הפעולה עם הרגל השנייה.",
"youtubeVideoId": "mlNXJKRYklQ"
},
{
"exerciseName": {
"en": "Hip Flexor Stretch",
"he": "מתיחת כופפי הירך"
},
"exerciseDescription": "כרעו על ברך אחת כאשר הרגל השנייה מכופפת לפניכם בזווית של 90 מעלות. דחפו את האגן קדימה עד שתרגישו מתיחה בכופפי הירך של הרגל האחורית. החזיקו למשך 30 שניות וחזרו על הפעולה עם הרגל השנייה.",
"youtubeVideoId": "bDWeLkeCbBg"
},
{
"exerciseName": {
"en": "IT Band Stretch",
"he": "מתיחת רצועת ה-IT"
},
"exerciseDescription": "עמדו עם רגל אחת חוצה את השנייה מאחור. התכופפו לצד הרגל הקדמית עד שתרגישו מתיחה בצד החיצוני של הירך. החזיקו למשך 30 שניות וחזרו על הפעולה עם הרגל השנייה.",
"youtubeVideoId": "MO2ZNz03YEI"
}
],
"injury": "runners knee"
}`
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err := w.Write([]byte(jsontest))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
