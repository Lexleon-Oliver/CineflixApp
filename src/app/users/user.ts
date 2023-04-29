export interface User {
  "id": number,
  "name": string,
  "avatarUrl": string,
  "moviesLastModified": string,
  "seriesLastModified": string
}

export interface UsersResponse{
  "users": [
    User
  ]
}
