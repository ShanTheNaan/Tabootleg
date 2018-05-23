import json

print("Enter file name of existing json file containing cards to add to: ")
# Previously TabooCards.json
jsonFileName = input()
print("Enter file name of text file containing new card information: ")
# Previously TabooText.txt
textFileName = input()

with open(jsonFileName) as f:
    data = f.read()
    cardArr = json.loads(data)

cards = cardArr["tabooCards"]

with open(textFileName) as f:
    while (True):
        obj = {}
        temp = f.readline()
        if temp:
            obj["cardName"] = temp.strip()
            obj["banned"] = []
            for i in range(5):
                obj["banned"].append(f.readline().strip())

            f.readline()
            cards.append(obj)
            print(obj)
        else:
            break

cardArr["tabooCards"] = cards

with open("TabooCards.json", "w") as f:
    json.dump(cardArr, f)
