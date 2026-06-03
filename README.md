# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d0e229be-ec64-4a81-b563-b6514bf6522c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d0e229be-ec64-4a81-b563-b6514bf6522c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d0e229be-ec64-4a81-b563-b6514bf6522c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## How to customize this project

### Basic Configuration
**File to edit: `src/config.json`**

#### Couple Information
```json
"couple": {
  "firstName": "ליאור",
  "partnerName": "איתן",
  "lastName": "הלימי",
  "photoPath": "/src/assets/couple-photo.jpg"
}
```
- Update names and photo path for the couple
- **Files to replace:**
  - `src/assets/couple-photo.jpg` - Replace with your couple photo
  - `src/assets/developer-logo.png` - Replace with your app icon/logo

#### App Settings
```json
"app": {
  "iconPath": "/src/assets/developer-logo.png",
  "title": {
    "hebrew": "ברכת המזון",
    "english": "Birkat Hamazon",
    "french": "Birkat Hamazon"
  },
  "shortName": "Birkat Hamazon"
}
```
- Customize the app icon and titles in different languages

#### Default Settings
```json
"settings": {
  "supportedNosach": ["ashkenaz", "edot-hamizrah"],
  "supportedLanguages": ["hebrew", "french", "english"],
  "defaults": {
    "nosach": "ashkenaz",
    "language": "hebrew",
    "fontSize": 18,
    "phoneticMode": false
  }
}
```
- Adjust default language, nosach (prayer tradition), font size, and phonetic mode

### Prayer Texts
**Files to edit:**
- `src/data/birkatTexts.json` - Contains all prayer texts in Hebrew, French, and English
- `src/data/birkatText.ts` - TypeScript definitions for prayer text structure
- `src/data/translations.ts` - UI translations for different languages
