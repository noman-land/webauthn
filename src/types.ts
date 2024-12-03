import { AuthenticationJSON, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

export interface HonoTypes {
  Bindings: Env;
}

export interface ChallengeSession {
  challenge: string;
  origin: string;
}

export interface AuthenticationChecks {
  challenge: string | Function;
  origin: string | Function;
  userVerified: boolean;
  counter?: number;
  domain?: string;
  verbose?: boolean;
}

interface ChallengeBody {
  sessionId: string;
}

export interface RegistrationBody extends ChallengeBody {
  registration: RegistrationJSON;
}

export interface AuthenticationBody extends ChallengeBody {
  authentication: AuthenticationJSON;
}
