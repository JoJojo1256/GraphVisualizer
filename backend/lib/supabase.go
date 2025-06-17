package lib

import (
	"fmt"
	"os"

	supa "github.com/nedpals/supabase-go"
)

var Supabase *supa.Client

func InitSupabase() error {
	supabaseUrl := os.Getenv("NEXT_PUBLIC_SUPABASE_URL")
	supabaseKey := os.Getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

	if supabaseUrl == "" || supabaseKey == "" {
		return fmt.Errorf("missing Supabase credentials")
	}

	Supabase = supa.CreateClient(supabaseUrl, supabaseKey)
	return nil
}

func TestSupabaseConnection() error {
	var result []map[string]interface{}
	err := Supabase.DB.From("users").Select("*").Limit(1).Execute(&result)
	if err != nil {
		return fmt.Errorf("supabase connection error: %v", err)
	}
	fmt.Println("Supabase connection successful:", result)
	return nil
} 