import  json
import requests
app_id  = "54188eb4"
app_key  = "4c299bfceedc9256b019ddde5f7f3d05"
endpoint = "entries"
language_code = "en-us"
word_id = "example"
url = "https://od-api-sandbox.oxforddictionaries.com/api/v2" + endpoint + "/" + language_code + "/" + word_id.lower()
r = requests.get(url, headers = {"app_id": app_id, "app_key": app_key})
print("code {}\n".format(r.status_code))
print("text \n" + r.text)
print("json \n" + json.dumps(r.json()))