import requests
import json
import os
import pandas as pd
import csv

if not os.path.exists('nostr_relays.json'):
    URL = 'https://api.nostr.watch/v1/online'
    r = requests.get(URL)
    nostr_relay_data = r.json()
    with open('nostr_relays.json', 'w') as f:
        json.dump(nostr_relay_data, f)
else:
    print("Relays already downloaded")

if not os.path.exists('nostr_relays.csv'):
    df = pd.read_json('nostr_relays.json')
    header_row = ['nostr_relay_address']
    df.columns = header_row + list(df.columns[len(header_row):])
    df.to_csv('nostr_relays.csv', index=False)
else:
    print("Relays already converted to csv")