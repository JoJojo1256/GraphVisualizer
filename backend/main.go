package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"graph-theory-visualization/lib"
)

// HashPassword takes a plain text password and returns a bcrypt hash
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares a bcrypt hashed password with its possible plaintext equivalent
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

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
		fmt.Printf("All users in database: %+v\n", users)
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

		// Log the received data (without password)
		fmt.Printf("Login attempt - Email: %s\n", loginData.Email)
		fmt.Printf("Login attempt - Password: %s\n", loginData.Password)

		if loginData.Email == "" || loginData.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
			return
		}

		// First check if user exists
		var existingUsers []map[string]interface{}
		err := lib.Supabase.DB.From("users").
			Select("*").
			Filter("email", "eq", loginData.Email).
			Execute(&existingUsers)
		if err != nil {
			fmt.Printf("Error checking existing user: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to check user existence",
			})
			return
		}

		if len(existingUsers) == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No account found with this email. Please sign up first.",
			})
			return
		}

		// Verify password
		err = bcrypt.CompareHashAndPassword([]byte(existingUsers[0]["password"].(string)), []byte(loginData.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Incorrect password. Please try again.",
			})
			return
		}

		// Get number_ids from proof_templates
		var proofTemplates []map[string]interface{}
		if existingUsers[0]["proofs_completed"] != nil {
			proofIds := existingUsers[0]["proofs_completed"].([]interface{})
			if len(proofIds) > 0 {
				// Convert []interface{} to []string
				stringProofIds := make([]string, len(proofIds))
				for i, id := range proofIds {
					if numId, ok := id.(float64); ok {  // JSON numbers are decoded as float64
						stringProofIds[i] = fmt.Sprintf("%d", int(numId))  // Convert to string
					} else {
						fmt.Printf("Warning: Invalid proof ID type: %+v\n", id)
					}
				}

				err = lib.Supabase.DB.From("proof_templates").
					Select("id").
					In("id", stringProofIds).  // Now passing []string
					Execute(&proofTemplates)
				if err != nil {
					fmt.Printf("Error fetching proof templates: %v\n", err)
					c.JSON(http.StatusInternalServerError, gin.H{
						"error": "Failed to fetch proof templates",
					})
					return
				}
			}
		}

		// Extract ids
		var numberIds []int
		for _, template := range proofTemplates {
			if numberId, ok := template["id"].(float64); ok {
				numberIds = append(numberIds, int(numberId))
			} else {
				fmt.Printf("Warning: Invalid id type in template: %+v\n", template)
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
			"user": gin.H{
				"email":            loginData.Email,
				"proofs_completed": numberIds,
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

		// Log the received data (without password)
		fmt.Printf("Signup attempt - Email: %s\n", signupData.Email)

		if signupData.Email == "" || signupData.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
			return
		}

		// Check if user already exists
		var existingUsers []map[string]interface{}
		err := lib.Supabase.DB.From("users").
			Select("*").
			Filter("email", "eq", signupData.Email).
			Execute(&existingUsers)
		if err != nil {
			fmt.Printf("Error checking existing user: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to check if user exists",
			})
			return
		}

		if len(existingUsers) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "An account with this email already exists. Please log in instead.",
			})
			return
		}

		// Validate password
		if len(signupData.Password) < 6 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Password must be at least 6 characters long",
			})
			return
		}

		// Validate email format
		if !strings.Contains(signupData.Email, "@") || !strings.Contains(signupData.Email, ".") {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Please enter a valid email address",
			})
			return
		}

		// Hash the password
		hashedPassword, err := HashPassword(signupData.Password)
		if err != nil {
			fmt.Printf("Error hashing password: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to process password",
			})
			return
		}

		fmt.Printf("Original password: %s\n", signupData.Password)
		fmt.Printf("Hashed password: %s\n", hashedPassword)

		// Create new user
		var result []map[string]interface{}
		err = lib.Supabase.DB.From("users").
			Insert(map[string]interface{}{
				"email":    signupData.Email,
				"password": hashedPassword,
				"proofs_completed": []string{},
			}).
			Execute(&result)

		if err != nil {
			fmt.Printf("Error creating user: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create user",
			})
			return
		}

		// Return success response
		c.JSON(http.StatusOK, gin.H{
			"message": "User created successfully",
			"user": gin.H{
				"email": signupData.Email,
				"proofs_completed": []string{},
			},
		})
	})

	// Update proofs completed endpoint
	r.POST("/update-proofs", func(c *gin.Context) {
		var updateData struct {
			Email string `json:"email"`
			Proofs []int `json:"proofs"`
		}

		// Log the raw request body
		body, _ := c.GetRawData()
		fmt.Printf("Raw request body: %s\n", string(body))
		c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))

		if err := c.ShouldBindJSON(&updateData); err != nil {
			fmt.Printf("Error binding JSON: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		fmt.Printf("Parsed update data - Email: %q, Proofs: %v\n", updateData.Email, updateData.Proofs)

		if updateData.Email == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User must be logged in"})
			return
		}

		// First check if user exists
		var existingUsers []map[string]interface{}
		err := lib.Supabase.DB.From("users").
			Select("*").
			Filter("email", "eq", updateData.Email).
			Execute(&existingUsers)
		if err != nil {
			fmt.Printf("Error checking existing user: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to check user existence",
			})
			return
		}

		fmt.Printf("Found existing users: %+v\n", existingUsers)
		if len(existingUsers) > 0 {
			fmt.Printf("User details - Email: %v, Current proofs: %v\n", 
				existingUsers[0]["email"], 
				existingUsers[0]["proofs_completed"])
		}

		if len(existingUsers) == 0 {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "User not found",
			})
			return
		}

		// Get proof IDs from ids
		var proofTemplates []map[string]interface{}
		if len(updateData.Proofs) > 0 {
			// Convert []int to []string for the query
			stringNumberIds := make([]string, len(updateData.Proofs))
			for i, id := range updateData.Proofs {
				stringNumberIds[i] = fmt.Sprintf("%d", id)
			}
			fmt.Printf("Querying proof_templates with ids: %v\n", stringNumberIds)
			
			err = lib.Supabase.DB.From("proof_templates").
				Select("id").
				In("id", stringNumberIds).
				Execute(&proofTemplates)
			if err != nil {
				fmt.Printf("Error fetching proof templates: %v\n", err)
				fmt.Printf("Error details - Type: %T, Value: %v\n", err, err)
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": fmt.Sprintf("Failed to fetch proof templates: %v", err),
				})
				return
			}
			fmt.Printf("Found proof templates: %+v\n", proofTemplates)
		}

		// Extract proof IDs
		var proofIds []string
		for _, template := range proofTemplates {
			if id, ok := template["id"].(float64); ok {  // Changed from string to float64
				proofIds = append(proofIds, fmt.Sprintf("%d", int(id)))  // Convert number to string
			} else {
				fmt.Printf("Warning: Invalid id type in template: %+v\n", template)
			}
		}
		fmt.Printf("Extracted proof IDs: %v\n", proofIds)

		// Update user's proofs in database
		var result []map[string]interface{}
		err = lib.Supabase.DB.From("users").
			Update(map[string]interface{}{
				"proofs_completed": proofIds, // This will be an empty array if no proofs
			}).
			Filter("email", "eq", updateData.Email).
			Execute(&result)

		if err != nil {
			fmt.Printf("Error updating proofs: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Failed to update proofs: %v", err),
			})
			return
		}

		fmt.Printf("Update result: %+v\n", result)

		c.JSON(http.StatusOK, gin.H{
			"message": "Proofs updated successfully",
			"proofs":  proofIds,
		})
	})

	// Start server
	if err := r.Run(":8000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
} 