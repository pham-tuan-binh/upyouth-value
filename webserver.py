import os
import http.server
import socketserver
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

PORT = 3000
DIRECTORY = "./"  # Replace with your directory

class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        print(f"File {event.src_path} has been modified. Refresh your browser.")

def start_server():
    os.chdir(DIRECTORY)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()

def start_watcher():
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=DIRECTORY, recursive=True)
    observer.start()
    observer.join()

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    start_watcher()
