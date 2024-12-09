export interface Profile {
    id: number;
    name: string;
    username: string;
    profile_photo: string;
}

export interface ProfileData {
    access: string;
    status_request: string;
    username: string;
    name: string;
    work_history: string;
    skills: string;
    connection_count: number;
    profile_photo: string;
    relevant_posts: Feed[];
}

interface Feed {
    id: number;
    content: string;
    updated_at: string;
    user_id: number;
    viewer_id: number;
}