# Firebase Storage Security Rules

The CORS error you're experiencing is likely due to Firebase Storage security rules. You need to update your Firebase Storage rules to allow authenticated users to upload files.

## Steps to Fix:

### 1. Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kiti-room`
3. Go to **Storage** in the left sidebar
4. Click on the **Rules** tab

### 2. Update Storage Rules
Replace your current storage rules with the following:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read all uploaded files
    match /uploads/{allPaths=**} {
      allow read: if request.auth != null;
    }
    
    // Default rule - deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Publish the Rules
1. Click **Publish** after updating the rules
2. Wait for the rules to be deployed (usually takes a few seconds)

## Alternative Rules (More Permissive for Development)
If you're still having issues, you can temporarily use more permissive rules for development:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow all authenticated users to read/write (for development only)
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Warning**: The alternative rules above are less secure and should only be used for development. For production, use the first set of rules.

## What These Rules Do:
- **First rule**: Allows users to upload files to their own folder (`/uploads/{userId}/...`)
- **Second rule**: Allows all authenticated users to read uploaded files
- **Third rule**: Denies access to everything else

## Testing
After updating the rules:
1. Try uploading again from your app
2. Check the browser console for any remaining errors
3. The uploads should now work without CORS errors

## Troubleshooting
If you still get CORS errors:
1. Make sure you're logged in to your Firebase app
2. Check that the user object has a valid `uid`
3. Verify the rules were published successfully
4. Try refreshing the page and logging in again
