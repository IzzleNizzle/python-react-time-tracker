import os
import base64
from functools import wraps
from flask import session, redirect, request
import requests
import time
from jose import jwk, jwt
from jose.utils import base64url_decode

LOGIN_REDIRECT_URL = os.environ.get("LOGIN_URL")
COGNITO_CLIENT_ID = os.environ.get("COGNITO_CLIENT_ID")
COGNITO_APP_DOMAIN = os.environ.get("COGNITO_APP_DOMAIN")
COGNITO_CLIENT_SECRET = os.environ.get("COGNITO_CLIENT_SECRET")
COGNITO_APP_REGION = os.environ.get("COGNITO_APP_REGION")
REDIRECT_URL = os.environ.get("REDIRECT_URL")
COGNITO_USERPOOL_ID = os.environ.get("COGNITO_USERPOOL_ID")
ENVIRONMENT = os.environ.get("ENVIRONMENT")


def authenticate_with_cognito(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        try:
            if "uuid" in session:
                print(f'Logged in as {session["uuid"]}')
                return func(*args, **kwargs)
            else:
                # logic to check if user has been redirected after loging in
                auth_code = request.args.get("code")
                if not auth_code or auth_code is None:
                    print("no auth_code")
                    return redirect(LOGIN_REDIRECT_URL)
                response_dict = get_auth_call_incognito(auth_code)
                token = response_dict["id_token"]
                claims = get_verified_cognito_jwt_claims(token)
                # session log in success
                session["uuid"] = claims["sub"]
                return func(*args, **kwargs)
        except Exception as error:
            print(f"decorated_function error: {error}")
            return redirect(LOGIN_REDIRECT_URL)

    @wraps(func)
    def plain_wrapper(*args, **kwargs):
        session["uuid"] = "63b0f404-d3e9-4e65-8b25-378de26e8cdd"
        return func(*args, **kwargs)

    if ENVIRONMENT == "production":
        return decorated_function
    else:
        return plain_wrapper


def get_verified_cognito_jwt_claims(token):
    # get the kid from the headers prior to verification
    kid = get_kid_from_headers(token)
    keys = get_jwt_public_keys()
    key_index = find_kid_in_public_keys(kid, keys)
    if key_index == -1:
        raise ValueError("Public key not found in jwks.json.")
    verify_jwt_key(keys[key_index], token)
    # since we passed the verification, we can now safely
    # use the unverified claims
    claims = jwt.get_unverified_claims(token)
    verify_token_expiry(claims)
    verify_token_audience(claims)
    # now we can use the claims
    return claims


def verify_token_expiry(claims):
    if time.time() > claims["exp"]:
        raise ValueError("Token is expired")


def verify_token_audience(claims):
    if claims["aud"] != COGNITO_CLIENT_ID:
        raise ValueError("Token was not issued for this audience")


def verify_jwt_key(public_key, token):
    # construct the public key
    public_key = jwk.construct(public_key)
    # get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit(".", 1)
    # decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
    # verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        raise ValueError("Signature verification failed")


def get_kid_from_headers(token):
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    return kid


def find_kid_in_public_keys(kid, keys):
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    return key_index


def get_jwt_public_keys():
    keys_url = "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(
        COGNITO_APP_REGION, COGNITO_USERPOOL_ID
    )
    keys_response = requests.request("GET", keys_url)
    keys = keys_response.json()["keys"]
    return keys


def get_auth_call_incognito(auth_code):
    credentials = f"{COGNITO_CLIENT_ID}:{COGNITO_CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode())
    headers = {
        "Authorization": f"Basic {encoded_credentials.decode()}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    params = {
        "grant_type": "authorization_code",
        "client_id": COGNITO_CLIENT_ID,
        "code": auth_code,
        "redirect_uri": REDIRECT_URL,
    }
    cognito_url = (
        f"https://{COGNITO_APP_DOMAIN}.auth."
        f"{COGNITO_APP_REGION}.amazoncognito.com/oauth2/token"
    )

    response = requests.request("POST", cognito_url, headers=headers, params=params)
    if response.status_code == 400 or response.status_code == 500:
        raise ValueError(
            f"Bad response get_auth_call_incognito: {response.status_code}"
        )
    return response.json()


def logout():
    session.pop("uuid", None)


def main(string_input):
    print("i fired")
    return string_input
