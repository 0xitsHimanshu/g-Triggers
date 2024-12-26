import { Provider } from "@supabase/supabase-js";

export interface PlatformDetails {
  access_token: string | undefined;
  refresh_token: string | undefined;
  provider_name: Provider;
  user_name: string;
}

// Platforms interface
export interface Platforms {
  twitch?: PlatformDetails;
  youtube?: PlatformDetails;
}

// User metadata interface
export interface UserMetadata {
  platforms?: Platforms;
  [key: string]: any; // For other potential metadata
}

// User interface
export interface User {
  user_metadata: UserMetadata;
  [key: string]: any; // For other user properties
}

// Props interface
export interface ConnectAccountProps {
  user: User;
}