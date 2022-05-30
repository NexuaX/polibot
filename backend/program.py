import glob
from flask import Flask
import gensim
import numpy as np
import re
from scipy import spatial

global ml_model

app = Flask(__name__)


def load_model():
    model = gensim.models.KeyedVectors.load("model_nlp/google.model")
    return model


def get_average_vector(sentence, model, vector_size=300):
    temp = np.zeros(vector_size)
    for i in sentence.split():
        try:
            temp += model[i]
        except KeyError:
            temp += 1
    temp = temp / len(sentence.split())
    return temp


def get_list_of_most_similar(user_command, bot_commands, model, threshold=0.7):
    most_similar_list = {}
    most_similar_list_final = {}
    user_vector = get_average_vector(user_command, model)
    for command in bot_commands:
        bot_command = get_average_vector(command, model)
        similarity = spatial.distance.cosine(user_vector, bot_command)
        if similarity < threshold:
            most_similar_list[command] = similarity
    most_similar_list_sorted = sorted(most_similar_list.items(), key=lambda x: x[1])
    for i in most_similar_list_sorted:
        most_similar_list_final[i[0]] = i[1]
    print(most_similar_list_final)
    return most_similar_list_final


def get_list_of_commands():
    list_of_commands = []
    path_of_commands = glob.glob("../commands/*.js")
    for i in path_of_commands:
       temp = re.findall('[\w-]+\.', i)
       list_of_commands.append(temp[0][0:-1])
    return list_of_commands


@app.route('/', methods=['GET'])
def index():
    return 'Machine Learning Inference'


@app.route('/prediction/<command>')
def get_prediction(command=''):
    global ml_model
    bot_commands = get_list_of_commands()
    list_of_command = get_list_of_most_similar(user_command=command, bot_commands=bot_commands, model=ml_model)
    return list_of_command


if __name__ == '__main__':
    ml_model = load_model()
    app.run(port=9090)

