class AlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {name = 'untitled', year} = request.payload;

    const albumId = await this._service.addAlbum({name, year});

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const {id} = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);

    const albumContainsSongs = {...album, songs};

    return {
      status: 'success',
      data: {
        album: albumContainsSongs,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const {id} = request.params;
    const {name, year} = request.payload;

    await this._service.editAlbumById(id, {name, year});

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const {id} = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postUploadAlbumCoverHandler(request, h) {
    const {cover} = request.payload;
    const {id} = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(
        cover,
        cover.hapi,
    );

    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._service.editAlbumCover(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Cover album berhasil disimpan',
      data: {
        fileLocation,
      },
    });
    response.code(201);
    return response;
  }

  async postAlbumLikesHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    const message = await this._service.addAlbumLikes(id, credentialId);

    const response = h.response({
      status: 'success',
      message,
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const {id} = request.params;
    const {likes, isCache} = await this._service.getAlbumLikes(id);
    return h
        .response({
          status: 'success',
          data: {
            likes,
          },
        })
        .header('X-Data-Source', isCache ? 'cache' : 'db');
  }
}

module.exports = AlbumsHandler;
