### Step-by-step OAuth2 Flow with Hydra: from `/oauth2/auth` to `/callback`

---

### 1. **User initiates the OAuth2 login**

**URL:**

```
http://localhost:4444/oauth2/auth?client_id=...&redirect_uri=http://localhost:4000/callback&response_type=code&scope=openid+offline&state=...
```

* This is the **authorization request** from client (frontend or backend) to Hydra.
* It includes:

  * `client_id`: identifies the app asking for authentication.
  * `redirect_uri`: the final URL where Hydra will send the user after success.
  * `response_type=code`: means client expects an authorization code.
  * `scope`: requested scopes (like openid, offline for refresh tokens).
  * `state`: to maintain client state between request and callback.

---

### 2. **Hydra starts the login flow**

* Hydra sees this request and:

  * Checks if the user is already logged in.
  * If not, **redirects the user to `/login` endpoint** (or wherever the login is implemented ).

---

### 3. **User logs in via `/login` endpoint**

* User submits credentials (email/password or social login).
* `/login` endpoint verifies the credentials.
* If successful, `/login` endpoint **calls Hydra Admin API to accept the login challenge**
  (using the `login_challenge`).
* Hydra knows the user is authenticated and proceeds to the consent step.
* `/login` endpoint then returns a **redirect URL** from Hydra, which frontend
  follows (usually to `/consent`).

---

### 4. **Hydra triggers consent request**

* Hydra sends the user (or client app) to `/consent` endpoint with a `consent_challenge`
  in the query params.
* `/consent` endpoint:

  * Checks the consent challenge.
  * Decides which scopes and claims to grant.
  * Optionally shows a **consent UI** for user approval (if needed).
  * Calls Hydra Admin API to **accept the consent challenge**.

---

### 5. **Hydra redirects user to final `redirect_uri`**

* Once consent is accepted, Hydra **redirects the user's browser** to the original
  `redirect_uri` we specified in step 1:

  ```
  http://localhost:4000/callback?code=AUTH_CODE&state=...
  ```

* This `code` is the OAuth authorization code the client will exchange for tokens.

---

### 6. **Client exchanges authorization code for tokens**

* The client backend/frontend calls Hydra's `/oauth2/token` endpoint with the authorization code.
* Hydra returns:

  * **Access token** (JWT, for API access).
  * **ID token** (OpenID Connect info about the user).
  * **Refresh token** (if requested).

---

### 7. **User is now authenticated and authorized**

* Client uses these tokens to authenticate requests, get user info, and maintain sessions.
* When access tokens expire, the client can use the refresh token to get new tokens without
  requiring the user to login again.

---

---

# Summary Diagram

```
Client ------> Hydra /oauth2/auth (with redirect_uri)   
       <------ Hydra redirects user to /login (with login_challenge)
User logs in on /login endpoint  
/login calls Hydra Admin API to accept login challenge  
       <------ Redirects user to /consent (with consent_challenge)
User approves consent (or auto-accept) on /consent endpoint  
/consent calls Hydra Admin API to accept consent challenge  
       <------ Hydra redirects user to redirect_uri (/callback) with code & state
Client exchanges code for tokens from Hydra  
Tokens issued -> user logged in successfully
```
