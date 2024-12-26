
interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    profile_image_url: string;
    offline_image_url: string;
    description: string;
    broadcaster_type: string;
    view_count: number;
    created_at: string;
    followers: number
  }
  
  interface TwitchStream {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tags: string[];
  }
  
  interface TwitchFollowers {
    total: number;
    data: Array<{
      user_id: string;
      user_login: string;
      user_name: string;
      followed_at: string;
    }>;
  }
  
  interface TwitchVideo {
    id: string;
    stream_id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    title: string;
    description: string;
    created_at: string;
    published_at: string;
    url: string;
    thumbnail_url: string;
    viewable: string;
    view_count: number;
    language: string;
    type: string;
    duration: string;
    videos: string;
  }