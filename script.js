class CognitoVisualizer {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.tokens = {
            idToken: null,
            accessToken: null,
            refreshToken: null
        };
        this.awsCredentials = null;
        this.currentStep = 0;
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        document.getElementById('signUpBtn').addEventListener('click', () => this.signUpUser());
        document.getElementById('signInBtn').addEventListener('click', () => this.signInUser());
        document.getElementById('federatedSignInBtn').addEventListener('click', () => this.federatedSignIn());
        document.getElementById('refreshTokenBtn').addEventListener('click', () => this.refreshTokens());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    async signUpUser() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        if (!email || !password) {
            this.addLog('error', 'Email and password required for sign up');
            return;
        }

        this.addLog('info', `Starting user registration for ${email}`);
        this.setActiveStep(1);

        // Simulate API call delay
        await this.delay(1000);

        // Check if user already exists
        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            this.addLog('error', 'User already exists');
            this.setActiveStep(0);
            return;
        }

        this.setActiveStep(2);
        this.addLog('info', 'Validating credentials with User Pool');
        
        await this.delay(1500);

        // Create new user
        const newUser = {
            id: this.generateId(),
            email: email,
            status: 'CONFIRMED',
            createdAt: new Date(),
            lastSignIn: null
        };

        this.users.push(newUser);
        this.currentUser = newUser;

        this.setActiveStep(3);
        this.addLog('success', 'User registered successfully');
        
        await this.delay(1000);

        // Generate tokens
        this.generateTokens();
        this.setActiveStep(4);
        
        await this.delay(1000);

        // Exchange for AWS credentials
        this.exchangeForAWSCredentials();
        this.setActiveStep(5);
        
        await this.delay(1000);

        this.grantAWSAccess();
        this.addLog('success', 'Sign up flow completed successfully');
        this.updateDisplay();
    }

    async signInUser() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        if (!email || !password) {
            this.addLog('error', 'Email and password required for sign in');
            return;
        }

        this.addLog('info', `Starting authentication for ${email}`);
        this.setActiveStep(1);

        await this.delay(1000);

        // Check if user exists
        const user = this.users.find(u => u.email === email);
        if (!user) {
            this.addLog('error', 'User not found. Please sign up first.');
            this.setActiveStep(0);
            return;
        }

        this.setActiveStep(2);
        this.addLog('info', 'Authenticating with User Pool');
        
        await this.delay(1500);

        // Simulate password validation
        this.currentUser = user;
        user.lastSignIn = new Date();

        this.setActiveStep(3);
        this.addLog('success', 'Authentication successful');
        
        await this.delay(1000);

        // Generate tokens
        this.generateTokens();
        this.setActiveStep(4);
        
        await this.delay(1000);

        // Exchange for AWS credentials
        this.exchangeForAWSCredentials();
        this.setActiveStep(5);
        
        await this.delay(1000);

        this.grantAWSAccess();
        this.addLog('success', 'Sign in flow completed successfully');
        this.updateDisplay();
    }

    async federatedSignIn() {
        this.addLog('info', 'Starting federated sign in with Google');
        this.setActiveStep(1);

        await this.delay(1000);

        // Simulate OAuth flow
        this.addLog('info', 'Redirecting to Google OAuth');
        
        await this.delay(2000);

        this.setActiveStep(2);
        this.addLog('info', 'Receiving OAuth callback');
        
        await this.delay(1000);

        // Create federated user
        const federatedUser = {
            id: this.generateId(),
            email: 'user@gmail.com',
            status: 'EXTERNAL_PROVIDER',
            provider: 'Google',
            createdAt: new Date(),
            lastSignIn: new Date()
        };

        this.users.push(federatedUser);
        this.currentUser = federatedUser;

        this.setActiveStep(3);
        this.addLog('success', 'Federated authentication successful');
        
        await this.delay(1000);

        // Generate tokens
        this.generateTokens();
        this.setActiveStep(4);
        
        await this.delay(1000);

        // Exchange for AWS credentials
        this.exchangeForAWSCredentials();
        this.setActiveStep(5);
        
        await this.delay(1000);

        this.grantAWSAccess();
        this.addLog('success', 'Federated sign in completed');
        
        // Update social provider status
        document.querySelectorAll('.social-provider').forEach(provider => {
            if (provider.textContent === 'Google') {
                provider.classList.add('active');
            }
        });
        
        this.updateDisplay();
    }

    async refreshTokens() {
        if (!this.tokens.refreshToken) {
            this.addLog('error', 'No refresh token available');
            return;
        }

        this.addLog('info', 'Refreshing access tokens');
        
        await this.delay(1000);

        // Generate new tokens
        this.tokens.idToken = this.generateJWT('id');
        this.tokens.accessToken = this.generateJWT('access');
        
        this.addLog('success', 'Tokens refreshed successfully');
        this.updateTokenDisplay();
    }

    generateTokens() {
        this.tokens.idToken = this.generateJWT('id');
        this.tokens.accessToken = this.generateJWT('access');
        this.tokens.refreshToken = this.generateJWT('refresh');
        
        this.addLog('success', 'JWT tokens generated');
        this.updateTokenDisplay();
    }

    generateJWT(type) {
        const header = btoa(JSON.stringify({
            "alg": "RS256",
            "typ": "JWT"
        }));

        let payload;
        switch(type) {
            case 'id':
                payload = {
                    "sub": this.currentUser.id,
                    "email": this.currentUser.email,
                    "email_verified": true,
                    "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example",
                    "aud": "example-client-id",
                    "token_use": "id",
                    "exp": Math.floor(Date.now() / 1000) + 3600
                };
                break;
            case 'access':
                payload = {
                    "sub": this.currentUser.id,
                    "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example",
                    "client_id": "example-client-id",
                    "token_use": "access",
                    "scope": "aws.cognito.signin.user.admin",
                    "exp": Math.floor(Date.now() / 1000) + 3600
                };
                break;
            case 'refresh':
                payload = {
                    "sub": this.currentUser.id,
                    "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example",
                    "client_id": "example-client-id",
                    "token_use": "refresh",
                    "exp": Math.floor(Date.now() / 1000) + (30 * 24 * 3600) // 30 days
                };
                break;
        }

        const encodedPayload = btoa(JSON.stringify(payload));
        const signature = btoa("signature-" + Math.random().toString(36).substr(2, 9));
        
        return `${header}.${encodedPayload}.${signature}`;
    }

    exchangeForAWSCredentials() {
        this.awsCredentials = {
            AccessKeyId: 'ASIA' + Math.random().toString(36).substr(2, 16).toUpperCase(),
            SecretAccessKey: Math.random().toString(36).substr(2, 40),
            SessionToken: 'IQoJb3JpZ2luX2VjE' + Math.random().toString(36).substr(2, 50),
            Expiration: new Date(Date.now() + 3600000).toISOString()
        };
        
        this.addLog('success', 'AWS temporary credentials issued');
        this.updateIdentityPoolDisplay();
    }

    grantAWSAccess() {
        const services = ['s3Service', 'dynamoService', 'lambdaService', 'apiService'];
        services.forEach(serviceId => {
            const service = document.getElementById(serviceId);
            service.classList.add('accessible');
            service.querySelector('.service-status').textContent = 'Access: Granted';
        });
        
        this.addLog('success', 'AWS service access granted');
    }

    setActiveStep(step) {
        this.currentStep = step;
        
        // Reset all steps
        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('active', 'completed');
        });
        
        // Set completed steps
        for (let i = 1; i < step; i++) {
            const stepElement = document.querySelector(`[data-step="${i}"]`);
            if (stepElement) {
                stepElement.classList.add('completed');
            }
        }
        
        // Set active step
        if (step > 0) {
            const activeStep = document.querySelector(`[data-step="${step}"]`);
            if (activeStep) {
                activeStep.classList.add('active');
            }
        }
    }

    updateDisplay() {
        // Update user status
        const userStatus = document.getElementById('userStatus');
        if (this.currentUser) {
            userStatus.textContent = `Authenticated as ${this.currentUser.email}`;
            userStatus.classList.add('authenticated');
        } else {
            userStatus.textContent = 'Not authenticated';
            userStatus.classList.remove('authenticated');
        }

        // Update user pool stats
        document.getElementById('totalUsers').textContent = this.users.length;
        document.getElementById('activeSessions').textContent = this.currentUser ? 1 : 0;

        // Update user list
        const usersContainer = document.querySelector('.users-container');
        usersContainer.innerHTML = '';
        this.users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.textContent = `${user.email} (${user.status})`;
            usersContainer.appendChild(userDiv);
        });

        this.updateIdentityPoolDisplay();
    }

    updateIdentityPoolDisplay() {
        // Update identity type
        const identityType = document.getElementById('identityType');
        if (this.currentUser) {
            if (this.currentUser.provider) {
                identityType.textContent = `Federated (${this.currentUser.provider})`;
            } else {
                identityType.textContent = 'Authenticated';
            }
        } else {
            identityType.textContent = 'None';
        }

        // Update AWS credentials status
        const awsCredentials = document.getElementById('awsCredentials');
        if (this.awsCredentials) {
            awsCredentials.textContent = 'Temporary credentials issued';
        } else {
            awsCredentials.textContent = 'Not issued';
        }
    }

    updateTokenDisplay() {
        const tokenElements = {
            idToken: document.getElementById('idToken'),
            accessToken: document.getElementById('accessToken'),
            refreshToken: document.getElementById('refreshToken')
        };

        Object.keys(this.tokens).forEach(tokenType => {
            const element = tokenElements[tokenType];
            if (this.tokens[tokenType]) {
                element.textContent = this.tokens[tokenType];
                element.classList.add('has-token');
            } else {
                element.textContent = 'Not issued';
                element.classList.remove('has-token');
            }
        });
    }

    reset() {
        this.users = [];
        this.currentUser = null;
        this.tokens = {
            idToken: null,
            accessToken: null,
            refreshToken: null
        };
        this.awsCredentials = null;
        this.currentStep = 0;

        // Reset UI
        this.setActiveStep(0);
        this.updateDisplay();
        this.updateTokenDisplay();

        // Reset services
        const services = ['s3Service', 'dynamoService', 'lambdaService', 'apiService'];
        services.forEach(serviceId => {
            const service = document.getElementById(serviceId);
            service.classList.remove('accessible');
            service.querySelector('.service-status').textContent = 'Access: Denied';
        });

        // Reset social providers
        document.querySelectorAll('.social-provider').forEach(provider => {
            provider.classList.remove('active');
        });

        // Clear form
        document.getElementById('userEmail').value = '';
        document.getElementById('userPassword').value = '';

        // Clear logs
        const logsContainer = document.getElementById('logsContainer');
        logsContainer.innerHTML = '<div class="log-entry info"><span class="timestamp">Ready</span><span class="message">Cognito visualizer reset</span></div>';

        this.addLog('info', 'System reset completed');
    }

    addLog(type, message) {
        const logsContainer = document.getElementById('logsContainer');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message';
        messageSpan.textContent = message;
        
        logEntry.appendChild(timestamp);
        logEntry.appendChild(messageSpan);
        logsContainer.appendChild(logEntry);
        
        // Auto-scroll to bottom
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    generateId() {
        return 'user-' + Math.random().toString(36).substr(2, 9);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CognitoVisualizer();
});