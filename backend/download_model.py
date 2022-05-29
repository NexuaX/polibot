import gensim
import gensim.downloader as api

model = api.load('word2vec-google-news-300')
model.save('model_nlp/google.model')