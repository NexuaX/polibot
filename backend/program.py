import glob
from flask import Flask
import numpy as np
import re
from scipy import spatial
from sklearn.feature_extraction.text import CountVectorizer

global ml_model

app = Flask(__name__)


def get_average_vector(sentence, model, vector_size=300):
    temp = np.zeros(vector_size)
    for i in sentence.split():
        try:
            temp += model[i]
        except KeyError:
            temp += 1
    temp = temp / len(sentence.split())
    return temp


def get_list_of_most_similar(user_command, bot_commands, threshold=0.4):
    most_similar_list_final = {}
    most_similar_list = count_vectorizer(user_command, bot_commands, threshold=threshold)
    most_similar_list_sorted = sorted(most_similar_list.items(), key=lambda x: x[1])
    for i in most_similar_list_sorted:
        most_similar_list_final[i[0]] = i[1]
    print(most_similar_list_final)
    return most_similar_list_final


def count_vectorizer(user_command, bot_commands, threshold):
    most_similar_list = {}
    vectorizer = CountVectorizer(analyzer='char')
    vectorizer.fit(bot_commands)
    user_command = vectorizer.transform([user_command]).toarray()
    for command in bot_commands:
        bot_command = vectorizer.transform([command]).toarray()
        distance = spatial.distance.cosine(user_command, bot_command)
        if distance < threshold:
            most_similar_list[command] = distance
    return most_similar_list


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
    bot_commands = get_list_of_commands()
    list_of_command = get_list_of_most_similar(user_command=command, bot_commands=bot_commands)
    return list_of_command


if __name__ == '__main__':
    app.run(port=9090)
    app.config['JSON_SORT_KEYS'] = False

