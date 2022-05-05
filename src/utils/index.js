const mapSongDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  createdAt: created_at,
  updatedAt: updated_at,
  albumId: album_id,
});

const mapAlbumDBToModel = ({id, name, year, created_at, updated_at}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapUserDBToModel = ({
  id, username, password, fullname,
}) => ({
  id,
  username,
  password,
  fullname,
});

const mapGetPlaylistDBToModel = ({id, name, username}) => ({
  id, name, username,
});

const mapGetPlaylistActivitiesDBToModel = ({
  username, title, action, time,
}) => ({
  username, title, action, time,
});

module.exports = {
  mapAlbumDBToModel, mapSongDBToModel, mapUserDBToModel, mapGetPlaylistDBToModel, mapGetPlaylistActivitiesDBToModel,
};
