# Job Portal Website

Job Portal is a comprehensive web dashboard aimed at bridging the gap between students, companies, and the placement department of K.R. Mangalam University.
A comprehensive job portal platform where companies can onboard as recruiters to post job openings, and candidates can apply for these jobs. The platform includes a feed page, activity tracking, and tailored functionalities for both candidates and recruiters.

## Features

- **Company (Recruiter) Onboarding**: Companies can register, create profiles, and post job listings.
- **Candidate Onboarding**: Candidates can sign up, browse job listings, and apply for jobs.
- **Job Listings**: Recruiters create job posts with detailed descriptions and requirements, which candidates can explore and apply to.
- **Activity Feed**: Candidates have a personalized feed to keep track of applications and updates from recruiters.
- **User Dashboard**: Each user (candidate or recruiter) has a dashboard to manage their applications, jobs posted, and other activities.
- **Payment Integration**: Stripe is integrated as the payment gateway to enable additional services, such as premium job posting options for recruiters.
- **Authentication and Security**: Clerk handles user authentication, ensuring secure and reliable onboarding.

## Tools and Technologies

- **NextJS v14**: Backend framework used for scalable and efficient server-side development.
- **Supabase**: Used for handling storage needs, such as storing documents or resumes uploaded by candidates.
- **MongoDB**: Primary database used to store user profiles, job posts, applications, and related data.
- **Clerk**: Authentication solution used to handle user sign-ups, logins, and session management.
- **Stripe**: Payment processing solution for handling payments, subscriptions, and premium features.
- **Tailwind CSS**: CSS framework for creating responsive, modern UI components and layouts with minimal custom styling.
- **ShadCN**: Component library for building consistent and accessible UI elements, enhancing the app’s design and interactivity.

## Installation and Setup

To set up and run the application locally, follow these steps:

### 1. Clone the Repository

1. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   cd job-portal-website

2. Install Dependencies
Install the necessary dependencies using npm:
    ```bash
    npm install

3. Configure Environment Variables
    Create a .env.local file in the root directory and add the required environment variables. These include configurations for Clerk.
        ```bash 
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-api-key>
        CLERK_SECRET_KEY=<your-clerk-secret-key>

        NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
        NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    Create a .env file in the root directory and add the required environment variables. These include configurations Stripe, MongoDB, and Supabase.
        ```bash
        # Stripe
        STRIPE_SECRET_KEY=<your-stripe-secret-key>

        # MongoDB
        MONGODB_URI=<your-mongodb-uri>

        # Supabase
        SUPABASE_URL=<your-supabase-url>
        SUPABASE_KEY=<your-supabase-key>

4. Run the Application 
After setting up environment variables, you can start the application:
    ```bash
    npm run dev
The application should now be running locally. Access it by navigating to http://localhost:3000 in your browser.

## Contributing
Contributions are welcome! If you’d like to contribute, please fork the repository, create a branch, and submit a pull request. You can also open issues to report bugs or suggest new features.

## License
This project is licensed under the MIT License.
