import pandas as pd
from scipy.spatial import distance
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import RobustScaler
from sklearn.ensemble import GradientBoostingRegressor
import floorFunctions
import re

regex = re.compile("\([^()]*\)")


def sanitizeString(s):
    if s is None:
        return s
    if type(s) is str:
        s = re.sub(regex, "", s)
        s = s.replace(",", ".")
        s = float(s)
        return s
    else:
        return float(s)


categ_features = [
    "condition",
    "constructionYearRange",
    "typeOfBuilding",
    "structure",
    "floorType",
    "partitioning",
]

numeric_features = [
    "usableArea",
    #     'buildingArea',
    #  'totalUsableArea',
    "rooms",
    "balconies",
    "kitchens",
    "bathrooms",
    "noPark",
]


def cleanRows(df):
    # Remov rows with no lat/lng
    df = df[df.lat.isnull() == False]
    df = df[df.lng.isnull() == False]

    # Where there is no parking data, assume 0
    df.noPark.fillna(value=0, inplace=True)

    # Compute floorType from floor
    floorTypeDict = {}
    for e in df.floor.unique():
        floorTypeDict[e] = floorFunctions.getValidCell(e)
    for idx, row in df.iterrows():
        df.loc[idx, "floorType"] = floorTypeDict[row["floor"]]

    # Make sure numeric columns ar numbers
    for num_col in numeric_features:
        df[num_col] = df[num_col].apply(sanitizeString)

    # Make sure categorical columns are strings
    for categ_col in categ_features:
        df[categ_col] = df[categ_col].astype(str)

    # Replace missing values with the moast common value in the column
    df = df.apply(lambda x: x.fillna(x.value_counts().index[0]))

    return df


def createEncoders(data):
    categ_encoder = OneHotEncoder(handle_unknown="ignore")
    categ_encoder.fit(data[categ_features])

    num_encoder = RobustScaler()
    num_encoder.fit(data[numeric_features])

    return [categ_encoder, num_encoder]


def gen_labels(df, categ_encoder, num_encoder):
    categorical_features = df[categ_features]
    enc_categ_f = categ_encoder.transform(categorical_features)

    numerical_features = df[numeric_features]
    num_encoder.transform(numerical_features)

    df_num_and_catg = pd.concat(
        [
            numerical_features.reset_index(drop=True),
            pd.DataFrame(enc_categ_f.toarray()),
        ],
        axis=1,
    )

    return df_num_and_catg


train_data = {"apartments": pd.read_csv("data/Apartments.csv", low_memory=False)}

train_data_clean_cache = {}


def predict(test, locality, propertyType):
    if propertyType not in train_data_clean_cache:
        train_data_clean_cache[propertyType] = {}
    if locality not in train_data_clean_cache[propertyType]:
        df = train_data[propertyType]
        df = df[df.locality == locality]
        train_data_clean_cache[propertyType][locality] = cleanRows(df)

    train = train_data_clean_cache[propertyType][locality]
    test = cleanRows(test)

    print(f"train: {len(train)} test: {len(test)}")

    # If any column is missing in test data, fill in with moast
    # common value in test
    for c in categ_features + numeric_features:
        if c not in test.columns:
            print(f"{c} missing in train")
            test[c] = [train[c].value_counts().index[0] for i in range(len(test))]

    # Create feature encoders from based on both train and test data
    encoders = createEncoders(train)

    dist_matrix = pd.DataFrame(
        distance.cdist(train[["lat", "lng"]], test[["lat", "lng"]], "euclidean")
    )

    i = 0
    for idx, row in test.iterrows():
        nearby_indexs = dist_matrix[dist_matrix[i] < 0.005][i].index
        nearby = train.iloc[nearby_indexs]
        train_X = gen_labels(nearby, encoders[0], encoders[1])
        train_y = nearby[["price"]].values.ravel()

        X = gen_labels(pd.DataFrame([row]), encoders[0], encoders[1])

        grdb = GradientBoostingRegressor(
            n_estimators=3000,
            learning_rate=0.05,
            max_depth=4,
            max_features="sqrt",
            min_samples_leaf=15,
            min_samples_split=10,
            loss="huber",
            random_state=5,
        )
        grdb.fit(train_X, train_y)
        pred = grdb.predict(X)

        test.loc[idx, "price_predicted"] = pred[0]
        test.loc[idx, "comparables"] = nearby.to_json(orient="records")
        i = i + 1

    return test
