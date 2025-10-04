# account-helper

A Node.js web application for password reset and email verifications using the Appwrite SDK. Features a modern Material Design 3 interface for a seamless user experience.

## Features

- 🔒 Secure password reset using Appwrite authentication
- 🎨 Material Design 3 UI with modern aesthetics
- ✅ Client and server-side validation
- 📱 Fully responsive design
- 🚀 Easy to deploy and configure

## Prerequisites

- Node.js (v14 or higher)
- An Appwrite account and project
- Appwrite API key with appropriate permissions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AurAchieve/account-helper.git
cd account-helper
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your Appwrite credentials:
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
PORT=3000
```

## Configuration

### Appwrite Setup

1. Log in to your [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project or select an existing one
3. Navigate to **Settings** and copy your Project ID
4. Go to **API Keys** and create a new API key with the following scopes:
   - `users.read`
   - `users.write`
5. Copy the API key and add it to your `.env` file

### Password Reset Email Configuration

In your Appwrite project, configure the password reset email template to include a link to your application:

```
https://your-domain.com/?userId={{user}}&secret={{secret}}
```

Replace `your-domain.com` with your actual domain where this application is hosted.

## Usage

### Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Production

For production deployment, ensure you:
1. Set all environment variables properly
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "account-helper"
```

## API Endpoints

### `POST /api/reset-password`

Completes the password reset process.

**Request Body:**
```json
{
  "userId": "user_id_from_email",
  "secret": "secret_from_email",
  "password": "newpassword",
  "passwordConfirm": "newpassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful! You can now log in with your new password."
}
```

### `GET /health`

Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

## How It Works

1. User requests a password reset from your main application
2. Appwrite sends a password reset email with a link containing `userId` and `secret` parameters
3. User clicks the link and lands on this password reset page
4. User enters and confirms their new password
5. The application calls Appwrite's `updateRecovery` method to complete the reset
6. User receives confirmation and can log in with their new password

## Security Features

- Server-side validation of all inputs
- Password strength requirements (minimum 8 characters)
- Password confirmation matching
- Secure handling of Appwrite credentials via environment variables
- Token expiration handled by Appwrite

## Material Design 3

The interface follows Google's Material Design 3 principles:
- Modern color system with primary, secondary, and surface colors
- Elevated surfaces with proper shadows
- Responsive typography scale
- Smooth animations and transitions
- Accessible form controls

## Deployment

### Deploy to Cloud Platforms

**Heroku:**
```bash
heroku create your-app-name
heroku config:set APPWRITE_ENDPOINT=your_endpoint
heroku config:set APPWRITE_PROJECT_ID=your_project_id
heroku config:set APPWRITE_API_KEY=your_api_key
git push heroku main
```

**Vercel/Netlify:**
Add your environment variables in the platform's dashboard and deploy directly from your Git repository.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the GitHub repository.
