import pickle
with open("cognyx_model.pkl", "rb") as f:
    model = pickle.load(f)
print(model["features"])
