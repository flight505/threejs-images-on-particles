import { BufferAttribute, Matrix4, Vector3 } from 'three'

export function sortPoints(mesh, camera) {
  const vector = new Vector3()
  const { geometry } = mesh

  // Model View Projection matrix

  const matrix = new Matrix4()
  matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  matrix.multiply(mesh.matrixWorld)

  let index = geometry.getIndex()
  const positions = geometry.getAttribute('position').array
  const length = positions.length / 3

  if (index === null) {
    const array = new Uint16Array(length)

    for (let i = 0; i < length; i++) {
      array[i] = i
    }

    index = new BufferAttribute(array, 1)

    geometry.setIndex(index)
  }

  const sortArray = []

  for (let i = 0; i < length; i++) {
    vector.fromArray(positions, i * 3)
    vector.applyMatrix4(matrix)

    sortArray.push([vector.z, i])
  }

  function numericalSort(a, b) {
    return b[0] - a[0]
  }

  sortArray.sort(numericalSort)

  const indices = index.array

  for (let i = 0; i < length; i++) {
    indices[i] = sortArray[i][1]
  }

  geometry.index.needsUpdate = true
}
