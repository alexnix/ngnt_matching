import numpy as np
import matplotlib.pyplot as plt

center = [0, 0]

CLUSTER_LEN = 5

randomness_n = np.positive(np.random.randn(CLUSTER_LEN, 2) * 2)
randomness_p = np.negative(np.random.randn(CLUSTER_LEN, 2) * 2)

for i in range(0, CLUSTER_LEN):
    if randomness_n[i, 1] > 0:
        randomness_n[i, 1] *= -1
    if randomness_p[i, 1] < 0:
        randomness_p[i, 1] *= -1

#  print(randomness_p, "\n\n", randomness_n)

plt.scatter(randomness_p[:, 0], randomness_p[:, 1], c="r")
plt.scatter(randomness_n[:, 0], randomness_n[:, 1], c="g")
#  plt.show()

from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=2).fit(np.vstack([randomness_n, randomness_p]))
print(kmeans.labels_)

cluster_high = np.hstack([randomness_n, np.ones([CLUSTER_LEN, 1]) * 5])
cluster_low = np.hstack([randomness_p, np.ones([CLUSTER_LEN, 1]) * 0])

kmeans2 = KMeans(n_clusters=2).fit(np.vstack([cluster_high, cluster_low]))
print(kmeans2.labels_)
