class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumsByIdHandler = this.putAlbumsByIdHandler.bind(this);
    this.deleteAlbumsByIdHandler = this.deleteAlbumsByIdHandler.bind(this);
  }

  async postAlbumsHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);

    const albumsId = await this._service.addAlbums(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Albums berhasil ditambahkan',
      data: {
        albumId: albumsId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsByIdHandler(request) {
    const {id} = request.params;
    const album = await this._service.getAlbumsById(id);
    const songs = await this._service.getSongsInAlbum(id);
    const getDetailAlbumWichContainsSongs = {...album, songs};
    return {
      status: 'success',
      data: {
        album: getDetailAlbumWichContainsSongs,
      },
    };
  }

  async putAlbumsByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);
    const {id} = request.params;
    await this._service.editAlbumsById(id, request.payload);
    return {
      status: 'success',
      message: 'Albums berhasil diperbarui',
    };
  }

  async deleteAlbumsByIdHandler(request) {
    const {id} = request.params;
    await this._service.deleteAlbumsById(id);
    return {
      status: 'success',
      message: 'Albums berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
