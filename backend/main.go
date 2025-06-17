package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"graph-theory-visualization/lib"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Initialize Supabase
	if err := lib.InitSupabase(); err != nil {
		log.Fatal("Failed to initialize Supabase:", err)
	}

	// Test Supabase connection
	if err := lib.TestSupabaseConnection(); err != nil {
		log.Fatal("Failed to connect to Supabase:", err)
	}

	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Root endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to Graph Theory Visualization API",
		})
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	// Test Supabase connection endpoint
	r.GET("/test-supabase", func(c *gin.Context) {
		var users []map[string]interface{}
		err := lib.Supabase.DB.From("users").Select("*").Execute(&users)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Successfully connected to Supabase",
			"users": users,
		})
	})

	// Test connection endpoint
	r.GET("/test-connection", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Successfully connected to backend",
			"status": "ok",
		})
	})

	// Login endpoint
	r.POST("/login", func(c *gin.Context) {
		var loginData struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		// Log the received data
		fmt.Printf("Login attempt - Email: %s, Password: %s\n", loginData.Email, loginData.Password)

		if loginData.Email == "" || loginData.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
			return
		}

		// TODO: Add actual authentication logic here
		// For now, just return success
		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
			"user": gin.H{
				"email": loginData.Email,
			},
		})
	})

	// Signup endpoint
	r.POST("/signup", func(c *gin.Context) {
		var signupData struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.ShouldBindJSON(&signupData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		// Log the received data
		fmt.Printf("Signup attempt - Email: %s, Password: %s\n", signupData.Email, signupData.Password)

		if signupData.Email == "" || signupData.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
			return
		}

		// Create new user in Supabase
		newUser := map[string]interface{}{
			"email":    signupData.Email,
			"password": signupData.Password, // Note: In production, you should hash this password!
			"created_at": time.Now().UTC(),
		}

		var result []map[string]interface{}
		err := lib.Supabase.DB.From("users").Insert(newUser).Execute(&result)
		if err != nil {
			fmt.Printf("Error creating user: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create user",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Account created successfully",
			"user": result[0], // Return the created user data
		})
	})

	// Start server
	if err := r.Run(":8000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
} 