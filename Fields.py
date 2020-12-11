import pandas as pd
from sklearn.model_selection import train_test_split
from catboost import CatBoostRegressor

df = pd.read_csv("Fields.csv")
# Remove useless columns
df.drop(["_id", "area"], axis='columns', inplace=True)

# For simplicity just take fields in one locality
# df = df.loc[df["locality"] == "Bucuresti"]
# df.drop(["locality", "district"], axis='columns', inplace=True)

# for even more siplicity remove some more columns
df.drop(["publicTransport","access","tilt","approvals","water", "gas", "electricity", "sewerage", "visibility", "CUT", "POT"], axis='columns', inplace=True)

# Transport land area to number only
df["landArea"] = pd.to_numeric(df["landArea"], errors='coerce')
# Only number bigger than 100
df = df.loc[df["landArea"] > 100]

# Get the raget column (price) and remove it from dataset
prices = df["price"]
df.drop(["price"], axis='columns', inplace=True)
X_train, X_test, y_train, y_test = train_test_split(df, prices, test_size=0.25)

# print(X_train.shape, y_train.shape, X_test.shape, y_test.shape)
# print(X_train.columns)

print(X_train.head())

cat_columns = ["contructionOnLand", "landType", "landClassification", "locality", "district"]
for c in cat_columns:
    print(f'{c}: {X_train[c].unique()}')

# cat_features = ["water","gas","electricity","sewerage", "visibility", 'landType', 'landClassification', 'contructionOnLand', "CUT", "POT"]
#
# for f in cat_features:
#     values = df[f].unique()
#     print(f'{f} values are {values}')
#     replace_dict = {}
#     for v, idx in zip(values, range(len(values))):
#         replace_dict[v] = str(idx)
#     print(replace_dict)
#     df.replace(replace_dict, inplace=True)
# quit()

model = CatBoostRegressor()
model.fit(X_train, y_train, cat_columns)


y_pred = model.predict(X_test)
print(y_pred)
for i in range(10):
    print(y_pred[i], y_test.values[i], y_pred[i] - y_test.values[i])
# print(df.columns, df.head())
