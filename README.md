# Graph Theory Visualizer

This project is an interactive web application designed to help students and enthusiasts understand and visualize complex proofs in graph theory.

## Purpose

I created this project because I had trouble understanding and visualizing many proofs in my graph theory class at Brown University. The goal is to make abstract concepts more accessible through interactive visualizations and step-by-step explanations.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React framework)
- **Backend:** Go (Golang)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)

## Why Go for the Backend?

- **Performance:** Go is known for its speed and efficiency, making it ideal for handling concurrent requests.
- **Learning:** I wanted to learn Go and experience its benefits firsthand.
- **Simplicity:** Go's syntax and standard library make it easy to build robust APIs quickly.

## Features

- **Interactive Graph Proof Visualizations:** Step through graph theory proofs visually.
- **User Authentication:** Secure login and signup powered by Supabase and SQL.
- **Password Security:** All passwords are hashed and never stored in plain text.

## Security

- Passwords are hashed using bcrypt before being stored in the database.
- User authentication and session management are handled securely via Supabase.

## Getting Started

1. Clone the repo.
2. Set up environment variables for Supabase and other secrets in a `.env` file (not included in the repo for security).
3. Run the backend (Go) and frontend (Next.js) as described in their respective folders.

---

**This project is open source and welcomes contributions, especially from those interested in graph theory, education, or web development!**
