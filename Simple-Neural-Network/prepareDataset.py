#!/usr/bin/python3

import os
import json

datasetPath = "dataset/"
datasetFilePath = "dataset.json"
datasetFile = open(datasetFilePath, mode="w")
datasetFile.truncate()

result = [os.path.join(dp, f).replace("\\","/") for dp, dn, filenames in os.walk(datasetPath) for f in filenames if os.path.splitext(f)[1] == '.png']

json.dump(result, datasetFile)
