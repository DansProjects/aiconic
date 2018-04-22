# Import sys and tensorflow as tf
import tensorflow as tf, sys


class Classify:

    def diabetic_retin(image_path):
        # Read in the image_data
        image_data = tf.gfile.FastGFile(image_path, 'rb').read()

        # Loads label file, strips off carriage return
        label_lines = [line.rstrip() for line
                           in tf.gfile.GFile("./tf_files/retrained_labels.txt")]

        # Unpersists graph from file
        with tf.gfile.FastGFile("./tf_files/retrained_graph.pb", 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
            _ = tf.import_graph_def(graph_def, name='')

        with tf.Session() as sess:
            # Feed the image_data as input to the graph and get first prediction
            softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')

            # Predictions
            predictions = sess.run(softmax_tensor, {'DecodeJpeg/contents:0': image_data})

            # Sort to show labels of first prediction in order of confidence
            top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]

            # Loop through top_k
            diseased = 0
            notdiseased = 0
            for node_id in top_k:
                # Log the message
                if label_lines[node_id] == "diseased":
                    diseased =  predictions[0][node_id]
                elif label_lines[node_id] == "notdiseased":
                    notdiseased = predictions[0][node_id]

            return {"diseased": str(diseased), "notdiseased": str(notdiseased)}
