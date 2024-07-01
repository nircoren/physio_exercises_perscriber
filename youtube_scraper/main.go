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
	if injuryName == "" {
		http.Error(w, "Missing injury query parameter", http.StatusBadRequest)
		return
	}

	// Get the exercises from OpenAI
	system := `Your role is to receive input which is a name of an injury, and give names of the most relevant exercieses for patient to do.
    max exercises number is 5.
    return the exerciseDescription in hebrew.
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
	jsontest := `{
"exercises": [
{
"exerciseName": {
"en": "Nerve Gliding Exercise",
"he": "תרגיל החלקת עצב"
},
"exerciseDescription": "שב עם הזרוע שלך ישרה לפניך וכף היד כלפי מעלה. כופף את המרפק שלך כדי להביא את כף היד לכיוון הפנים שלך, ואז ישר את המרפק בחזרה. חזור על התרגיל 10 פעמים.",
"youtubeVideoId": "XP1yzpFR6ho"
},
{
"exerciseName": {
"en": "Wrist Flexor Stretch",
"he": "מתיחת כופפי שורש כף היד"
},
"exerciseDescription": "עמוד עם זרועך ישרה לפניך וכף היד כלפי מטה. בעזרת היד השנייה, משוך בעדינות את כף היד כלפי מעלה כדי למתוח את כופפי שורש כף היד. החזק למשך 15-30 שניות וחזור 3 פעמים.",
"youtubeVideoId": "ndDCV4Pi1lM"
},
{
"exerciseName": {
"en": "Wrist Extensor Stretch",
"he": "מתיחת מיישרי שורש כף היד"
},
"exerciseDescription": "עמוד עם זרועך ישרה לפניך וכף היד כלפי מעלה. בעזרת היד השנייה, משוך בעדינות את כף היד כלפי מטה כדי למתוח את מיישרי שורש כף היד. החזק למשך 15-30 שניות וחזור 3 פעמים.",
"youtubeVideoId": "ndDCV4Pi1lM"
},
{
"exerciseName": {
"en": "Elbow Flexion and Extension",
"he": "כיפוף והארכת המרפק"
},
"exerciseDescription": "שב עם הזרוע שלך ישרה לפניך. כופף את המרפק כדי להביא את היד לכיוון הכתף שלך, ואז ישר את המרפק בחזרה. חזור על התרגיל 10 פעמים.",
"youtubeVideoId": "cNbFI8Gft4A"
},
{
"exerciseName": {
"en": "Shoulder Shrugs",
"he": "הרמת כתפיים"
},
"exerciseDescription": "עמוד עם הכתפיים רפויות. הרם את הכתפיים כלפי מעלה לכיוון האוזניים שלך, ואז הורד אותן בחזרה. חזור על התרגיל 10 פעמים.",
"youtubeVideoId": "vXIlcRTL1TQ"
}
],
"injury": "ulnar nerve"
}`
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(jsontest); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
