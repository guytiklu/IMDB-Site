import http.server
import json
import socketserver
from urllib.parse import urlparse
from pip._vendor import requests

TYPES_MAP = {'js': 'javascript', 'css': 'css'}
PORT = 8000
IMDB_API_KEY = '1b50af57'
TOP_10_MOVIES_ID = ['tt0347149','tt0245429','tt0770828','tt2975590','tt0974015','tt1825683','tt3501632','tt4154756','tt4154796','tt3480822']

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        def set_headers():
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

        def set_bad_headers():
            self.send_response(400)
            self.send_header("Content-type", "application/json")
            self.end_headers()

        # parse the url, get params:
        url = urlparse(self.path)
        check_type = url.path.split('.')
        ext = None
        if len(check_type) > 1:
            ext = check_type[1]
        parameters = url.query
        if parameters != '':
            parameters = parameters.split("&")
            params = {}
            for param in parameters:
                x = param.split("=")
                params[x[0]] = x[1]

        # if client asks for css or js, provide:
        if ext in ['css', 'js']:
            f = open('assets/'+url.path[1:])
            self.send_response(200)
            self.send_header('Content-type', 'text/'+TYPES_MAP[ext])
            self.end_headers()
            self.wfile.write(f.read().encode())
            f.close()
            return

        # main screen controller:
        if url.path == '/':
            self.path = 'assets/MainScreen.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # top 10 movies request:
        elif url.path == '/get_top_10':
            ret = []
            for id in TOP_10_MOVIES_ID:
                url = 'http://www.omdbapi.com/?apikey='+IMDB_API_KEY+'&i='+id
                response = requests.get(url)
                ret.append(json.loads(response.text))
            set_headers()
            self.wfile.write(json.dumps(ret).encode())

        # search request:
        elif url.path == '/search':
            search = params['search']
            url = 'http://www.omdbapi.com/?apikey=' + IMDB_API_KEY + '&s='+search
            response = requests.get(url)
            parsed = json.loads(response.text)
            if parsed['Response'] == 'False':
                set_bad_headers()
                self.wfile.write(''.encode())
                return

            res = parsed['Search']
            ret = []
            for movie in res:
                id = movie['imdbID']
                url = 'http://www.omdbapi.com/?apikey='+IMDB_API_KEY+'&i='+id
                response = requests.get(url)
                ret.append(json.loads(response.text))
            set_headers()
            self.wfile.write(json.dumps(ret).encode())


def run():
    handler_object = MyHttpRequestHandler
    my_server = socketserver.TCPServer(("", PORT), handler_object)
    print("running on 'localhost:8000'")
    my_server.serve_forever()
    

run()
