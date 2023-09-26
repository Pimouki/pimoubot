import spotipy
import asyncio
from dotenv import load_dotenv
from spotipy import oauth2
import os

load_dotenv()
# os.chdir('./Spotify')
# configure the Spotify API
scope = 'playlist-read-private user-modify-playback-state playlist-modify-private user-read-playback-state ' \
        'user-read-currently-playing playlist-modify-public playlist-modify-private'
username = os.getenv("CHANNEL")
client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
redirect_uri = 'http://localhost:8888/callback'

# create the Spotify authentication object
sp_oauth = oauth2.SpotifyOAuth(client_id=client_id, client_secret=client_secret,
                               redirect_uri=redirect_uri, scope=scope, cache_path=".cache-" + username)

# get the user's authentication token or refresh it if expired
token_info = sp_oauth.get_cached_token()
if not token_info:
    auth_url = sp_oauth.get_authorize_url()
    print("Please visit this URL to authorize the application: " + auth_url)
    response = input("Enter the URL you were redirected to: ")
    code = sp_oauth.parse_response_code(response)
    token_info = sp_oauth.get_access_token(code)

# create the Spotify object using the token
sp = spotipy.Spotify(auth=token_info['access_token'])

# define the playlist ID for the target playlist
playlist_id = os.getenv("SPOTIFY_PLAYLIST_ID")


# define a function to add a track to the playlist
def add_track_to_playlist(track_uri):
    try:
        results = sp.playlist_add_items(playlist_id, [track_uri])
        sp.add_to_queue(track_uri)
        return True
    except:
        return False


# define a function to skip to the next track in the playlist
def skip_track_playlist():
    sp.next_track()


# define an asynchronous function to refresh the authentication token
async def refresh_token():
    global sp
    token_info = sp_oauth.get_cached_token()
    print('CEST EXPIRER SA RELANCE UN TOKEN')
    new_token_info = sp_oauth.refresh_access_token(token_info["refresh_token"])
    sp = spotipy.Spotify(auth=new_token_info['access_token'])



# define an asynchronous function to periodically refresh the authentication token
async def asyncloop():
    while True:
        await refresh_token()
        await asyncio.sleep(3600)  # wait 1 hour before the next iteration


# create an event loop to periodically refresh the authentication token
loop = asyncio.get_event_loop()
loop.create_task(asyncloop())

