# AWS Cognito Authentication Visualizer

An interactive web application that demonstrates how AWS Cognito works, including user authentication flows, JWT tokens, and AWS service access.

## Features

### Authentication Flows
- **User Registration**: Complete sign-up process with User Pool
- **User Sign-In**: Standard authentication with credentials
- **Federated Sign-In**: OAuth integration with social providers
- **Token Refresh**: Automatic token renewal process

### Architecture Components
- **User Pool**: User directory and authentication service
- **Identity Pool**: AWS credentials exchange service
- **JWT Tokens**: ID, Access, and Refresh token management
- **AWS Services**: Integrated service access control

### Real-time Visualization
- Step-by-step authentication flow
- Live token generation and display
- User management and session tracking
- AWS service access status

## How It Works

### 1. User Pool Authentication
```
User Credentials → Cognito User Pool → JWT Tokens
```
- Users register or sign in with email/password
- Cognito validates credentials and issues JWT tokens
- Supports both direct and federated authentication

### 2. Identity Pool Integration
```
JWT Tokens → Cognito Identity Pool → AWS Credentials
```
- JWT tokens are exchanged for temporary AWS credentials
- Supports both authenticated and unauthenticated access
- Integrates with multiple identity providers

### 3. AWS Service Access
```
AWS Credentials → AWS Services → Resource Access
```
- Temporary credentials provide secure access to AWS services
- Fine-grained permissions through IAM roles
- Automatic credential rotation and expiration

## Authentication Flow Steps

1. **User Registration/Login**: User provides credentials to client application
2. **User Pool Authentication**: Cognito User Pool validates credentials
3. **JWT Tokens Issued**: ID Token, Access Token, and Refresh Token returned
4. **Identity Pool Exchange**: JWT tokens exchanged for AWS credentials
5. **AWS Service Access**: Temporary credentials used to access AWS services

## JWT Token Types

### ID Token
- Contains user identity information
- Used for user profile and authentication status
- Includes claims like email, name, and custom attributes

### Access Token
- Used for API authorization
- Contains scopes and permissions
- Required for accessing Cognito User Pool APIs

### Refresh Token
- Long-lived token for obtaining new tokens
- Used when access tokens expire
- Enables seamless user experience

## Key Concepts

### User Pool
- User directory service
- Handles registration, authentication, and account recovery
- Supports custom attributes and user groups
- Integrates with social identity providers

### Identity Pool
- Provides AWS credentials to users
- Supports both authenticated and unauthenticated users
- Maps identity providers to IAM roles
- Enables fine-grained access control

### Federated Identity
- Integration with external identity providers
- Supports Google, Facebook, Amazon, and SAML providers
- Enables single sign-on (SSO) capabilities
- Reduces user friction and improves security

## Security Features

- **Multi-Factor Authentication (MFA)**: Additional security layer
- **Account Recovery**: Secure password reset process
- **User Verification**: Email and phone number verification
- **Advanced Security**: Risk-based authentication and device tracking

## Use Cases

- **Web Applications**: User authentication and authorization
- **Mobile Apps**: Secure user management and AWS access
- **Enterprise SSO**: Integration with corporate identity systems
- **API Security**: Token-based API authentication

## Getting Started

1. Open `index.html` in your web browser
2. Enter email and password in the form
3. Click "Sign Up User" to create a new user
4. Click "Sign In User" to authenticate
5. Try "Federated Sign In" for social authentication
6. Use "Refresh Token" to renew access tokens
7. Click "Reset" to clear all data and start over

## Interactive Features

- **Real-time Logs**: View authentication events as they happen
- **Token Display**: See actual JWT token structure and content
- **Service Status**: Monitor AWS service access permissions
- **User Management**: Track registered users and active sessions

## Educational Value

This visualizer helps developers understand:
- How Cognito authentication flows work
- The relationship between User Pools and Identity Pools
- JWT token structure and usage
- AWS service integration patterns
- Security best practices for user authentication

Perfect for learning AWS Cognito concepts, preparing for AWS certifications, or demonstrating authentication architecture to teams.

## Technical Implementation

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with flexbox and grid layouts
- **Animations**: Smooth transitions and visual feedback
- **Responsive**: Works on desktop, tablet, and mobile devices
- **No Dependencies**: Pure vanilla JavaScript implementation

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use this for educational purposes, presentations, or as a starting point for your own projects.