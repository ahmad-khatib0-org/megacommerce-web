# Customer Signup Flow

Two-step signup form for customer registration.

## Components

### SignupWrapper

Main component that manages the two-step form using Stepper.

- Step 1: Personal Information (username, first_name, last_name)
- Step 2: Authentication (email, password, password_confirmation)

### SignupPersonalInfoForm

Step 1 form for basic personal details.

### SignupAuthInfoForm

Step 2 form for authentication credentials.

### SignupHooks

- Initializes Mantine forms with Yup validation
- Sets up Uppy instance for image uploads (optional)
- Manages form state and file upload listeners

Image is validated:

- Max size: 2MB
- Types: PNG, WEBP, JPEG
- Aspect ratio: 1:1 (cropped)
