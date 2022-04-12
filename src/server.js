require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums/');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs/');
const ClientError = require('./exceptions/ClientError');


const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  // erorr handling ClientResponse
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const {response} = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    /** jika bukan ClientError,
     * lanjutkan dengan response sebelumnya (tanpa terintervensi)**/
    return response.continue || response;
  });

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
