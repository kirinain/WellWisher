# Firebase Setup Guide

This guide will help you set up Google Sign-In with Firebase for Kiti's Room.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if you don't need it)

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Build** → **Authentication**
2. Click "Get Started" if this is your first time
3. Go to the **Sign-in method** tab
4. Click on **Google** from the list of providers
5. Toggle the **Enable** switch
6. Select a support email from the dropdown
7. Click **Save**

## Step 3: Register Your Web App

1. Go to **Project Settings** (click the gear icon next to "Project Overview")
2. Scroll down to "Your apps" section
3. Click on the **Web** icon (`</>`)
4. Give your app a nickname (e.g., "Kiti's Room")
5. Click **Register app**
6. Copy the Firebase configuration object

## Step 4: Create Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
touch .env.local
```

2. Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration values from Step 3.

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (for local development - should already be there)
   - Your production domain (e.g., `yourdomain.com`)

## Step 6: Test the Integration

1. Make sure your `.env.local` file is in the project root (it should be gitignored)
2. Restart your development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)
4. Click on "sign in with google"
5. A Google Sign-In popup should appear
6. Sign in with your Google account
7. After successful authentication, the button should change to "enter kiti's room"

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Make sure your domain is added to the Authorized domains list in Firebase Console
- For localhost, ensure it's listed (it should be by default)

### "Firebase: Error (auth/popup-blocked)"
- Your browser may be blocking popups
- Allow popups for localhost or your domain

### Environment variables not loading
- Make sure `.env.local` is in the project root
- Restart your development server after creating/modifying `.env.local`
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser

### Still having issues?
- Double-check all configuration values in `.env.local`
- Ensure Google authentication is enabled in Firebase Console
- Check the browser console for detailed error messages

## Security Notes

- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore`
- Your Firebase API key is safe to expose in the frontend (it's paired with authorized domains)
- For production, make sure to set up proper security rules in Firebase

## Next Steps

After successful authentication, you can:
- Redirect users to a protected room/dashboard
- Access user information via `useAuth()` hook
- Implement sign-out functionality
- Add more authentication providers (Facebook, Twitter, etc.)

Example usage in any component:

```tsx
"use client"

import { useAuth } from "@/lib/useAuth"

export function MyComponent() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) return <div>Please sign in</div>
  
  return (
    <div>
      <h1>Welcome {user.displayName}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

