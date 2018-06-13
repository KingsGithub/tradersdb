import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/storage";
export default 
function uploadFile(file, document) {  // returns downloadURL
    // Create the file metadata

    var metadata = {
      traderId: document.traderId,
      leaseId: document.leaseId,
      createdBy : document.createdBy,
      filetype: file.type
    };

    const storageRef = firebase.storage().ref();
    //storageRef.addChild('images');

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('documents/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.loadProgress = progress;
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              },
              function(error) {

                      // A full list of error codes is available at
                      // https://firebase.google.com/docs/storage/web/handle-errors
                      switch (error.code) {
                        case 'storage/unauthorized':
                          // User doesn't have permission to access the object
                          break;

                        case 'storage/canceled':
                          // User canceled the upload
                          break;
                        /// ETC. TO DO STUFF HERE...
                        case 'storage/unknown':
                          // Unknown error occurred, inspect error.serverResponse
                          break;
                      }
                      return '';
                    },
                    function() {
                      // Upload completed successfully, now we can get the download URL
                      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        console.log('File available at', downloadURL);
                        document.downloadURL = downloadURL;
                      });
                  });
}
