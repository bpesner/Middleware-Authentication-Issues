//import {repository, Filter} from '@loopback/repository';
//import {bind, inject} from '@loopback/context';
import {bind} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';

export interface Credentials {
  username: string;
  password: string;
}

@bind(asAuthStrategy)
export class BasicAuthenticationStrategy implements AuthenticationStrategy {
  name = 'HTTPBasic';
  private httpError: HttpErrors.HttpError = new HttpErrors.Unauthorized();

  constructor(
  ) {
    this.httpError.properties = { headers: { 'WWW-Authenticate': 'Basic' }};
  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {

/* create user profile */
    const userProfile: UserProfile = {[securityId]: '', name: ''};

    const credentials: Credentials = this.extractCredentials(request);

/* validate credentials */
    if (!credentials) {
      this.httpError.message = 'no credentials';
      throw this.httpError;
    }

    if (!credentials.username) {
      this.httpError.message = 'username or password is missing';
      throw this.httpError;
    }

// accept any username

    if (!credentials.password) {
      this.httpError.message = 'username or password is missing';
      throw this.httpError;
    }

// accept any password

    userProfile.name = credentials.username;

    return userProfile;
  }

  extractCredentials(request: Request): Credentials {

    if (!request.headers.authorization) {
      this.httpError.message = `Authorization header not found.`;
      throw this.httpError;
    }

    // for example : Basic Z2l6bW9AZ21haWwuY29tOnBhc3N3b3Jk
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Basic')) {
      this.httpError.message = `Authorization header is not of type 'Basic'.`;
      throw this.httpError;
    }

    //split the string into 2 parts. We are interested in the base64 portion
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      this.httpError.message =
        `Authorization header value has too many parts. It must follow the pattern: 'Basic xxyyzz' where xxyyzz is a base64 string.`;
      throw this.httpError;
    }
    const encryptedCredentails = parts[1];

    // decrypt the credentials. Should look like :   'username:password'
    const decryptedCredentails = Buffer.from(
      encryptedCredentails,
      'base64',
    ).toString('utf8');

    //split the string into 2 parts
    const decryptedParts = decryptedCredentails.split(':');

    if (decryptedParts.length !== 2) {
      this.httpError.message =
        `Authorization header 'Basic' value does not contain two parts separated by ':'.`;
      throw this.httpError;
    }

    const creds: Credentials = {
      username: decryptedParts[0],
      password: decryptedParts[1],
    };

    return creds;
  }
}
