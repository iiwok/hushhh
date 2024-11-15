# Frontend

## **About the Frontend**
The frontend of the project is built with **Next.js** in **TypeScript**. It provides a responsive, minimalistic user interface for secret submission and viewing.

## **Pages**
1. **Home Page (`/`)**: 
   - Displays the receipt feed of secrets.
   - Contains a simple form for secret submission.
2. **Error Page (`/error`)**:
   - Displays a user-friendly error message when an issue occurs.

## **Relevant Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## **Backend Integration**
The frontend communicates with the Supabase backend via REST APIs:
- **POST /submit**: Submit a secret for processing.
- **GET /feed**: Retrieve the secrets for the receipt feed.

## **Rules**
1. Form validation for secret submission (e.g., maximum character count, empty fields).
2. Ensure proper error handling and user feedback for failed submissions.

## **Technologies**
- **React** (UI framework)
- **TailwindCSS** (for styling)
- **TypeScript** (static typing for safer development)
- **Next.js** (server-side rendering and static site generation)
