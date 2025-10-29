# Shop Ahora

Shop Ahora is a shopping store that allows users to browse and purchase products. The app is built using Next.js, Tailwind CSS for styling, Shadcn UI for UI components, MongoDB for database management, Clerk for authentication and authorization, and Cloudinary for image storage.

## Tech Stack

- Next.js
- Tailwind CSS
- Shadcn UI
- MongoDB
- Clerk
- Cloudinary

## Features

- User authentication and authorization using Clerk
- Product listing and search functionality
- Cart functionality for adding and removing products
- Order creation and tracking functionality
- Responsive design for mobile and desktop

## Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

- `NEXT_PUBLIC_BASE_URL`: The base URL of the application
- `MONGODB_URI`: The URI for your MongoDB database
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`: The URL to redirect to after signing up
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `NEXT_PUBLIC_CURRENCY`: The currency to use for the application (default is USD)

## Deployment

To deploy the application, you can use any hosting service that supports Node.js and MongoDB.

## Screenshots

<div>
  <img src="/public/screenshots/screenshot-1.png" alt="Home 1" width="300" />
  <img src="/public/screenshots/screenshot-2.png" alt="Home 2" width="300" />
  <img src="/public/screenshots/screenshot-3.png" alt="Home 3" width="300" />
  <img src="/public/screenshots/screenshot-4.png" alt="Cart" width="300" />
  <img src="/public/screenshots/screenshot-5.png" alt="Orders" width="300" />
  <img src="/public/screenshots/screenshot-6.png" alt="Add Product" width="300" />
</div>

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request.
