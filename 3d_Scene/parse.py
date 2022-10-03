#!/usr/bin/python3
#
# Generates a js file from a obj file
#
# Will create a js file named <object name>.js and have a class of the object name
# containing arrays called 'vertices', 'indices', 'normals', and 'uvs'
#
# Treats all objects and object groups as a single object, all vertices are assumed
# to be the same object. Only supports triangular faces, quadrilateral are not supported.
# All faces are assumed to contain a vertex index, normal index, and texture index.
#
# robust error checking is not present, a valid obj file conforming to the assumptions
# above should be used.
#
# usage:
#       python3 parse.py <obj file> <object name>
#
import sys

if len(sys.argv) == 3:
    fobj = open(sys.argv[1], "r")
    fjs = open(sys.argv[2] + ".js", "w")
else:
    print("usage: python3 parse.py <obj file> <object name>")
    exit(-1)


# index ordered data (top of obj file)
vertices = []
uvs = []
normals = []

# data to be written to js file
vertices_out = []
uvs_out = []
normals_out = []
indices_out = []

index = 0

for line in fobj:
    words = line.strip().split(" ")

    if words[0] == "v":
        vertex = (words[1], words[2], words[3])
        vertices.append(vertex)

    if words[0] == "vt":
        uv = (words[1], words[2])
        uvs.append(uv)

    if words[0] == "vn":
        normal = (words[1], words[2], words[3])
        normals.append(normal)

    if words[0] == "f":
        for i in range (3):
            data = words[i+1].split("/")
            vi = int(data[0])
            ti = int(data[1])
            ni = int(data[2])

            # obj file vertices are 1 indexed, our lists are 0 indexed
            vertices_out.append(vertices[vi-1][0])
            vertices_out.append(vertices[vi-1][1])
            vertices_out.append(vertices[vi-1][2])

            indices_out.append(index)
            index = index + 1

            uvs_out.append(uvs[ti-1][0])
            uvs_out.append(uvs[ti-1][1])

            normals_out.append(normals[ni-1][0])
            normals_out.append(normals[ni-1][1])
            normals_out.append(normals[ni-1][2])

fobj.close()

## write data out to js file ##
fjs.write("class " + sys.argv[2] + " {")

# vertices
fjs.write("\n\n\tverts = [\n")
i = 0
while i < len(vertices_out):
    fjs.write("\t")
    fjs.write(vertices_out[i])
    fjs.write(", ")
    fjs.write(vertices_out[i+1])
    fjs.write(", ")
    fjs.write(vertices_out[i+2])
    if(i != len(vertices_out) - 3):
        fjs.write(", ")
        fjs.write("\n")

    i = i + 3

fjs.write("];")


# normals
fjs.write("\n\n\tnormals = [\n")
i = 0
while i < len(vertices_out):
    fjs.write("\t")
    fjs.write(normals_out[i])
    fjs.write(", ")
    fjs.write(normals_out[i+1])
    fjs.write(", ")
    fjs.write(normals_out[i+2])
    if(i != len(normals_out) - 3):
        fjs.write(", ")
        fjs.write("\n")

    i = i + 3

fjs.write("];")


# uvs
fjs.write("\n\n\tuvs = [\n")
i = 0
while i < len(uvs_out):
    fjs.write("\t")
    fjs.write(uvs_out[i])
    fjs.write(", ")
    fjs.write(uvs_out[i+1])
    if(i != len(uvs_out) - 2):
        fjs.write(",\n")

    i = i + 2

fjs.write("];")


# indices
fjs.write("\n\n\tindices = [\n")
for i in range(len(indices_out)):
    fjs.write("\t")
    fjs.write(str(indices_out[i]))
    fjs.write(",\n")

fjs.write("\t];")

fjs.write("\n\n}")

fjs.close()
