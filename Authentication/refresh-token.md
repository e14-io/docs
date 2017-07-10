# Refresh token

`A Refresh Token is a special kind of token that can be used to obtain a renewed access token —that allows accessing
a protected resource— at any time. You can request new access tokens until the refresh token expires.`

## Some considerations

- Refresh token expiration time should be greater than auth token.
- Refresh token cannot be used to get resources.
- Clients get new auth token using the refresh token, once they get a new token they can access protected resources.

## Security consideration

- What happens if we want to remove user access ?
  - Since we are using JWT in both tokens, every time we access a resource we don't want to access db to check if auth
  token is valid in order to take advantage of the magic behind JWT.

  - For that reason the way to keep the api secure is configuring short-lived access tokens, moving the db user
    verification when we are renewing auth token.


## How do we handle it:

- Use two different secrets, one to access private resources, and the other to get access token.

### Refresh token invalidation

- We have one version number inside the Jwt that we use to check against the user version storage in the db.
  If this version are equals we give a new auth token, but if they are not we throw an exception.
- So if we want invalidate refresh token we just update this version number.

#### Pros
- We don't save the refresh token in the db, so every time one user opens a session in a new device gets a new
 refresh token (with new expiration time).
- If we want to remove access to a user when we update this version number all the refresh token that used the older
 version are not longer valid.


##### Documentation
https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens
