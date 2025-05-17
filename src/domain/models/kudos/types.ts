/**
 * Type of kudos that can be given
 * Can be any string to support dynamic category names from the API
 */
export type KudosType = string;

/**
 * Icon mapping for each kudos type
 */
export type KudosIcon = 
  | 'trophy'  // Well Done
  | 'users'   // Great Teamwork
  | 'medal'   // Proud of You
  | 'rocket'  // Outstanding Achievement
  | 'bulb'    // Brilliant Idea
  | 'support' // Amazing Support;

/**
 * Theme color mapping for each kudos type
 */
export interface KudosTheme {
  bgColor: string;
  iconColor: string;
  textColor: string;
}

/**
 * User information in kudos context
 */
export interface KudosUser {
  id: number;
  name: string;
  team: string;
  avatarUrl: string;
}

/**
 * Main kudos interface
 */
export interface Kudos {
  id: string;
  type: KudosType;
  recipient: KudosUser;
  message: string;
  sender: KudosUser;
  createdAt: Date;
} 