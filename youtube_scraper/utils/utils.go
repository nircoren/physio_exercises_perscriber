package utils

import (
	"os"

	"github.com/joho/godotenv"
)

func GetEnvVar(envKey string) string {
	err := godotenv.Load()
	if err != nil {

	}
	envVar := os.Getenv(envKey)
	return envVar
}
