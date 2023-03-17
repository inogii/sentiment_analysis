import os
import torch
import pickle
import json
import urllib.parse
from http.server import BaseHTTPRequestHandler, HTTPServer
from exercise_code.rnn.text_classifiers import RNNClassifier
from exercise_code.rnn.sentiment_dataset import tokenize

trained_model = None
device = None
w2i = None

def initialize():

    # USING GPU IF AVAILABLE

    if torch.cuda.is_available():
        device = torch.device('cuda')
    else:
        device = torch.device('cpu')

    # PARAMETERS FOR THE MODEL

    from exercise_code.rnn.sentiment_dataset import (
        download_data,
        load_vocab
    )

    i2dl_exercises_path = os.path.dirname(os.path.abspath(os.getcwd()))
    data_root = os.path.join(i2dl_exercises_path, "datasets", "SentimentData")
    base_dir = download_data(data_root)
    vocab = load_vocab(base_dir)
    w2i = vocab

     # IMPORTING THE MODEL

    model_dict = pickle.load(open("models/rnn_classifier.p", 'rb'))
    hparams = model_dict['hparams']
    num_embeddings = hparams['num_embeddings']
    embedding_dim = hparams['embedding_dim']
    hidden_size = hparams['hidden_size']
    use_lstm = hparams['use_lstm']
    trained_model = RNNClassifier(num_embeddings, embedding_dim, hidden_size, use_lstm)
    trained_model.load_state_dict(model_dict['state_dict'], strict=False)
    trained_model.to(device)
    trained_model.eval()

    return trained_model, device, w2i

def predict(text, trained_model, device, w2i):
    words = torch.tensor([
        w2i.get(word, w2i['<unk>'])
        for word in tokenize(text)
    ]).long().to(device).view(-1, 1)  # T x B

    pred = trained_model(words).item()
    
    #sent = pred > 0.5
    
    #print('Sentiment -> {}, Confidence -> {}'.format(
     #   ':)' if sent else ':(', pred if sent else 1 - pred
    #))

    return pred

class RequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        data = body.decode('utf8')
        data = urllib.parse.unquote(data)
        text = data[4:] #removing "msg=" part

        data = predict(text, trained_model, device, w2i)
        # Construct the response data
        response_data = {
            "message": "Request received successfully",
            "data": data
        }
        response_body = json.dumps(response_data).encode('utf-8')

        # Send the response back to the client
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(response_body)

if __name__ == '__main__':

    trained_model, device, w2i = initialize()

    # SETTING UP THE SERVER
    server_address = ('localhost', 1500)
    httpd = HTTPServer(server_address, RequestHandler)
    print('Server running at http://%s:%d' % server_address)
    httpd.serve_forever()

    








